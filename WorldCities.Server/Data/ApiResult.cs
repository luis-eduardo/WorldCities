using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

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
            string? sortOrder)
    {
        Data = data;
        PageIndex = pageIndex;
        PageSize = pageSize;
        TotalCount = count;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        SortColumn = sortColumn;
        SortOrder = sortOrder;
    }


    public static async Task<ApiResult<T>> CreateAsync(
            IQueryable<T> source,
            int pageIndex,
            int pageSize,
            string? sortColumn = null,
            string? sortOrder = null)
    {
        var count = await source.CountAsync();

        sortOrder = NormalizeSortOrder(sortOrder);

        source = ApplySorting(source, sortColumn, sortOrder);

        source = source
            .Skip(pageIndex * pageSize)
            .Take(pageSize);

        var data = await source.ToListAsync();

        return new ApiResult<T>(
            data,
            count,
            pageIndex,
            pageSize,
            sortColumn,
            sortOrder);
    }

    private static IQueryable<T> ApplySorting(IQueryable<T> source, string? sortColumn, string? sortOrder)
    {
        if (string.IsNullOrEmpty(sortColumn) || !IsValidProperty(sortColumn))
        {
            return source;
        }

        var clause = string.Format(
            "{0} {1}",
            sortColumn,
            sortOrder);

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
