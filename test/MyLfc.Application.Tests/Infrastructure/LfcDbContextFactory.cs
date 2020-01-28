using System;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MyLfc.Persistence;

namespace MyLfc.Application.Tests.Infrastructure
{
    public class LfcDbContextFactory
    {
        public static LiverpoolContext Create()
        {
            var options = new DbContextOptionsBuilder<LiverpoolContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            var operationalStoreOptions = Options.Create(new OperationalStoreOptions());
            var context = new LiverpoolContext(options, operationalStoreOptions);

            context.Database.EnsureCreated();

            return context;
        }

        public static void Destroy(LiverpoolContext context)
        {
            context.Database.EnsureDeleted();

            context.Dispose();
        }
    }
}
