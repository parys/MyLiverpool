using Microsoft.Extensions.DependencyInjection;
using MyLiverpool.Data.ResourceAccess.Interfaces;
using MyLiverpool.Data.ResourceAccess.Repositories;

namespace MyLiverpool.Data.ResourceAccess.Helpers
{
    public static class RepositoryInjectionsHelper
    {
        public static void RegisterRepositories(this IServiceCollection services)
        {
            services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IForumSubsectionRepository, ForumSubsectionRepository>();
            services.AddScoped<IForumThemeRepository, ForumThemeRepository>();
            services.AddScoped<IMaterialCommentRepository, MaterialCommentRepository>();
            services.AddScoped<IMaterialRepository, MaterialRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
        }
    }
}
