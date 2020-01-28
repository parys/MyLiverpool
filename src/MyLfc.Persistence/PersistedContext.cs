//using System.Linq;
//using IdentityServer4.EntityFramework.DbContexts;
//using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore;
//using MyLfc.Domain;
//using MyLfc.Domain.Polls;

//namespace MyLfc.Persistence
//{
//    public class PersisteDContext : PersistedGrantDbContext
//    {
//        private static bool _created = false;
//        public PersisteDContext(DbContextOptions<PersisteDContext> options) : base(options)
//        {
//            if (!_created)
//            {
//                _created = true;
//            }
//        }
        
      
//        protected override void OnModelCreating(ModelBuilder modelBuilder)
//        {
//            base.OnModelCreating(modelBuilder);
//        }
//    }
//}
