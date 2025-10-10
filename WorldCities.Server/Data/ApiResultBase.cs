using System.Reflection;

namespace WorldCities.Server.Data;

public class ApiResultBase<T>
{
    public static bool IsValidProperty(
            string propertyName,
            bool throwExceptionIfNotFound = true)
    {
        var prop = typeof(T).GetProperty(
            propertyName,
            BindingFlags.IgnoreCase |
            BindingFlags.Public |
            BindingFlags.Instance);
        if (prop == null && throwExceptionIfNotFound)
            throw new NotSupportedException(
                string.Format(
                    $"ERROR: Property '{propertyName}' does not exist.")
                );
        return prop != null;
    }
}