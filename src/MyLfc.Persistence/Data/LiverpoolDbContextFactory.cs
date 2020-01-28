using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MyLfc.Persistence.Data
{
    public class LiverpoolDbContextFactory : DesignTimeDbContextFactoryBase<LiverpoolContext>
    {
        protected override LiverpoolContext CreateNewInstance(DbContextOptions<LiverpoolContext> options, IOptions<OperationalStoreOptions> operationalStoreOptions)
        {
            return new LiverpoolContext(options, operationalStoreOptions);
        }
    }
}
