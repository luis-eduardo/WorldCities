using EFCore.BulkExtensions;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace WorldCities.Server.Data;

public class ApiResult<T> : ApiResultBase<T>
{
    public List<T> Data { get; private set; }
    public int PageIndex { get; private set; }
    public int PageSize { get; private set; }
    public int TotalCount { get; private set; }
    public int TotalPages { get; private set; }
    public string? SortColumn { get; private set; }
    public string? SortOrder { get; private set; }
    public string? FilterColumn { get; private set; }
    public string? FilterQuery { get; private set; }
    public bool HasPreviousPage
    {
        get
        {
            return (PageIndex > 0);
        }
    }
    public bool HasNextPage
    {
        get
        {
            return ((PageIndex + 1) < TotalPages);
        }
    }

    private ApiResult(
            List<T> data,
            int count,
            int pageIndex,
            int pageSize,
            string? sortColumn,
            string? sortOrder,
            string? filterColumn,
            string? filterQuery)
    {
        Data = data;
        PageIndex = pageIndex;
        PageSize = pageSize;
        TotalCount = count;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        SortColumn = sortColumn;
        SortOrder = sortOrder;
        FilterColumn = filterColumn;
        FilterQuery = filterQuery;
    }


    public static async Task<ApiResult<T>> CreateAsync(
            IQueryable<T> source,
            int pageIndex,
            int pageSize,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
    {
        source = ApplyFilter(source, filterColumn, filterQuery);

        var count = await source.CountAsync();

        sortOrder = NormalizeSortOrder(sortOrder);

        source = ApplySorting(source, sortColumn, sortOrder);

        source = source
            .Skip(pageIndex * pageSize)
            .Take(pageSize);

        #if DEBUG
        var sql = source.ToQueryString();
        #endif

        var data = await source.ToListAsync();

        return new ApiResult<T>(
            data,
            count,
            pageIndex,
            pageSize,
            sortColumn,
            sortOrder,
            filterColumn,
            filterQuery);
    }

    private static IQueryable<T> ApplyFilter(IQueryable<T> source, string? filterColumn, string? filterQuery)
    {
        if (string.IsNullOrEmpty(filterColumn)
            || string.IsNullOrEmpty(filterQuery)
            || !IsValidProperty(filterColumn))
        {
            return source;
        }

        var clause = $"{filterColumn}.StartsWith(@0)";
        return source.Where(clause, filterQuery);
    }

    private static IQueryable<T> ApplySorting(IQueryable<T> source, string? sortColumn, string? sortOrder)
    {
        if (string.IsNullOrEmpty(sortColumn) || !IsValidProperty(sortColumn))
        {
            return source;
        }

        var clause = $"{sortColumn} {sortOrder}";
        return source.OrderBy(clause);
    }

    private static string NormalizeSortOrder(string? sortOrder)
    {
        sortOrder = !string.IsNullOrEmpty(sortOrder) &&
                        sortOrder.Equals("ASC", StringComparison.OrdinalIgnoreCase)
                        ? "ASC"
                        : "DESC";
        return sortOrder;
    }
}
