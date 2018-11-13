using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace MyLiverpool.Data.ResourceAccess
{
    public class LiverpoolContextFactory : IDesignTimeDbContextFactory<LiverpoolContext>
    {
        private const string connectionString =
            "Server=.;Database=MyLiverpool11231;Trusted_Connection=True;MultipleActiveResultSets=true";
        public LiverpoolContext Create()
        {
        var optionsBuilder = new DbContextOptionsBuilder<LiverpoolContext>();
    //    optionsBuilder.UseOpenIddict<int>();
        optionsBuilder.UseSqlServer(connectionString);

        return new LiverpoolContext(optionsBuilder.Options);
        }

        public LiverpoolContext Create(DbContextFactoryOptions options)
        {
            var optionsBuilder = new DbContextOptionsBuilder<LiverpoolContext>();
       //     optionsBuilder.UseOpenIddict<int>();
            optionsBuilder.UseSqlServer(connectionString);

            return new LiverpoolContext(optionsBuilder.Options);
        }

        public LiverpoolContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<LiverpoolContext>();
      //      optionsBuilder.UseOpenIddict<int>();
            optionsBuilder.UseSqlServer(connectionString);

            return new LiverpoolContext(optionsBuilder.Options);
        }
    }
}
