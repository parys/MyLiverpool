using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.Data.SqlClient;

namespace MyLfc.Persistence
{
    public static class SortExtensions
    {

        public static IOrderedQueryable<T> ObjectSort<T>(this IQueryable<T> entities, Expression<Func<T, object>> expression, SortOrder order = SortOrder.Ascending)
        {
            if (expression.Body is UnaryExpression unaryExpression)
            {
                var propertyExpression = (MemberExpression)unaryExpression.Operand;
                var parameters = expression.Parameters;

                if (propertyExpression.Type == typeof(DateTime))
                {
                    var newExpression = Expression.Lambda<Func<T, DateTime>>(propertyExpression, parameters);
                    return order == SortOrder.Ascending ? entities.OrderBy(newExpression) : entities.OrderByDescending(newExpression);
                }
                if (propertyExpression.Type == typeof(DateTime?))
                {
                    var newExpression = Expression.Lambda<Func<T, DateTime?>>(propertyExpression, parameters);
                    return order == SortOrder.Ascending ? entities.OrderBy(newExpression) : entities.OrderByDescending(newExpression);
                }

                if (propertyExpression.Type == typeof(int))
                {
                    var newExpression = Expression.Lambda<Func<T, int>>(propertyExpression, parameters);
                    return order == SortOrder.Ascending ? entities.OrderBy(newExpression) : entities.OrderByDescending(newExpression);
                }

                if (propertyExpression.Type == typeof(DateTimeOffset))
                {
                    var newExpression = Expression.Lambda<Func<T, DateTimeOffset>>(propertyExpression, parameters);
                    return order == SortOrder.Ascending ? entities.OrderBy(newExpression) : entities.OrderByDescending(newExpression);
                }

                if (propertyExpression.Type == typeof(DateTimeOffset?))
                {
                    var newExpression = Expression.Lambda<Func<T, DateTimeOffset?>>(propertyExpression, parameters);
                    return order == SortOrder.Ascending ? entities.OrderBy(newExpression) : entities.OrderByDescending(newExpression);
                }

                throw new NotSupportedException("Object type resolution not implemented for this type");
            }
            return order == SortOrder.Ascending 
                ? entities.OrderBy(expression)
                : entities.OrderByDescending(expression);
        }
    }
}
