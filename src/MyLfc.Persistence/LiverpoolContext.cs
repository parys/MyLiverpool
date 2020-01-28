using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Extensions;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MyLfc.Domain;
using MyLfc.Domain.Polls;

namespace MyLfc.Persistence
{
    public class LiverpoolContext : IdentityDbContext<User, Role, int>, IPersistedGrantDbContext
    {
        private static bool _created = false;
        private readonly IOptions<OperationalStoreOptions> _operationalStoreOptions;

        public LiverpoolContext(DbContextOptions<LiverpoolContext> options,
            IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options)
        {
            _operationalStoreOptions = operationalStoreOptions;
        }

        public DbSet<Wish> Wishes { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<MaterialCategory> MaterialCategories { get; set; }
        public DbSet<MaterialComment> MaterialComments { get; set; }
        public DbSet<ForumSection> ForumSections { get; set; }
        public DbSet<ForumSubsection> ForumSubsections { get; set; }
        public DbSet<ForumTheme> ForumThemes { get; set; }
        public DbSet<ForumMessage> ForumMessages { get; set; }
        public DbSet<RoleGroup> RoleGroups { get; set; }
        public DbSet<RoleRoleGroup> RoleRoleGroups { get; set; }
        public DbSet<PrivateMessage> PrivateMessages { get; set; }
        public DbSet<Club> Clubs { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<HelpEntity> HelpEntities { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Stadium> Stadiums { get; set; }
        public DbSet<UserConfig> UserConfigs { get; set; }
        public DbSet<Transfer> Transfers { get; set; }
        public DbSet<CommentVote> CommentVotes { get; set; }
        public DbSet<Injury> Injuries { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<MatchEvent> MatchEvents { get; set; }
        public DbSet<MatchPerson> MatchPersons { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Poll> Polls { get; set; }
        public DbSet<PollAnswer> PollAnswers { get; set; }
        public DbSet<PollAnswerUser> PollAnswerUsers { get; set; }
        public DbSet<FaqItem> FaqItems { get; set; }
        public DbSet<FaqCategory> FaqCategories { get; set; }

        //public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        //{
        //    var en = ChangeTracker.Entries();
        //    var entities = (from entry in ChangeTracker.Entries()
        //                    where entry.State == EntityState.Modified || entry.State == EntityState.Added
        //                    select entry.Entity);

        //    var validationResults = new List<ValidationResult>();
        //    foreach (var entity in entities)
        //    {
        //        if (!Validator.TryValidateObject(entity, new ValidationContext(entity), validationResults))
        //        {
        //            // throw new ValidationException() or do whatever you want
        //        }
        //    }
        //    return base.SaveChangesAsync(cancellationToken);
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(LiverpoolContext).Assembly);

            modelBuilder.Entity<MaterialComment>().HasOne(x => x.Author).WithMany(x => x.Comments).HasForeignKey(x => x.AuthorId);
            modelBuilder.Entity<ForumMessage>().HasOne(x => x.Author).WithMany(u => u.ForumMessages).HasForeignKey(x => x.AuthorId);
           
             
            modelBuilder.Entity<MaterialComment>().HasOne(u => u.Material).WithMany(x => x.Comments).HasForeignKey(x => x.MaterialId).IsRequired(false);
            modelBuilder.Entity<MaterialComment>().HasOne(u => u.Match).WithMany(x => x.Comments).HasForeignKey(x => x.MatchId).IsRequired(false);
            modelBuilder.Entity<MaterialComment>().HasOne(u => u.Poll).WithMany(x => x.Comments).HasForeignKey(x => x.PollId).IsRequired(false);
            

            modelBuilder.Entity<ForumSubsection>().HasOne(x => x.Section).WithMany(x => x.Subsections).HasForeignKey(x => x.SectionId);
            modelBuilder.Entity<ForumTheme>().HasOne(x => x.Subsection).WithMany(x => x.Themes).HasForeignKey(x => x.SubsectionId);
            modelBuilder.Entity<ForumMessage>().HasOne(x => x.Theme).WithMany(x => x.Messages).HasForeignKey(x => x.ThemeId);

            modelBuilder.Entity<User>().HasOne(x => x.RoleGroup).WithMany(x => x.Users).HasForeignKey(x => x.RoleGroupId);

            modelBuilder.Entity<UserConfig>().HasKey(x => x.UserId);
            modelBuilder.Entity<UserConfig>().Property(x => x.UserId).ValueGeneratedNever();
            modelBuilder.Entity<UserConfig>().HasOne(x => x.User).WithOne(x => x.UserConfig).IsRequired();

            modelBuilder.Entity<CommentVote>().HasKey(t => new { t.UserId, t.CommentId });
            modelBuilder.Entity<MaterialComment>().HasMany(x => x.CommentVotes).WithOne(x => x.Comment)
                .HasForeignKey(x => x.CommentId);
            modelBuilder.Entity<User>().HasMany(x => x.CommentVotes).WithOne(x => x.User)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<User>().HasMany(x => x.Notifications).WithOne(x => x.User)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<RoleRoleGroup>().HasKey(t => new { t.RoleId, t.RoleGroupId });
            modelBuilder.Entity<RoleRoleGroup>()
               .HasOne(pt => pt.Role)
               .WithMany(p => p.RoleRoleGroups)
               .HasForeignKey(pt => pt.RoleId);

            modelBuilder.Entity<RoleRoleGroup>()
                .HasOne(pt => pt.RoleGroup)
                .WithMany(t => t.RoleGroups)
                .HasForeignKey(pt => pt.RoleGroupId);


            modelBuilder.Entity<MatchPerson>().HasKey(t => new { t.MatchId, t.PersonId });
            modelBuilder.Entity<MatchPerson>()
                .HasOne(pt => pt.Match)
                .WithMany(p => p.Persons)
                .HasForeignKey(pt => pt.MatchId);

            modelBuilder.Entity<MatchPerson>()
                .HasOne(pt => pt.Person)
                .WithMany(t => t.Matches)
                .HasForeignKey(pt => pt.PersonId);

            modelBuilder.Entity<PrivateMessage>().HasOne(x => x.Sender).WithMany(x => x.SentPrivateMessages).HasForeignKey(x => x.SenderId);
            modelBuilder.Entity<PrivateMessage>().HasOne(x => x.Receiver).WithMany(x => x.ReceivedPrivateMessages).HasForeignKey(x => x.ReceiverId);

            modelBuilder.Entity<Match>().HasOne(x => x.Club).WithMany(x => x.Matches).HasForeignKey(x => x.ClubId);
            modelBuilder.Entity<Club>().HasOne(x => x.Stadium).WithMany(x => x.Clubs).HasForeignKey(x => x.StadiumId);
            modelBuilder.Entity<Match>().HasOne(x => x.Stadium).WithMany(x => x.Matches).HasForeignKey(x => x.StadiumId);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(x => x.Author)
                .WithMany(x => x.ChatMessages)
                .HasForeignKey(x => x.AuthorId);

            modelBuilder.Entity<Match>().HasOne(m => m.Season).WithMany(s => s.Matches).HasForeignKey(m => m.SeasonId);
            modelBuilder.Entity<Transfer>().HasOne(x => x.Person).WithMany(x => x.Transfers).HasForeignKey(x => x.PersonId);
            modelBuilder.Entity<Transfer>().HasOne(x => x.Club).WithMany(x => x.Transfers).HasForeignKey(x => x.ClubId).IsRequired(false);
            modelBuilder.Entity<Loan>().HasOne(x => x.Person).WithMany(x => x.Loans).HasForeignKey(x => x.PersonId);
            modelBuilder.Entity<Loan>().HasOne(x => x.Club).WithMany(x => x.Loans).HasForeignKey(x => x.ClubId);
            modelBuilder.Entity<Injury>().HasOne(x => x.Person).WithMany(x => x.Injuries).HasForeignKey(x => x.PersonId);
            
            modelBuilder.Entity<MatchEvent>().HasOne(x => x.Season).WithMany(x => x.Events).HasForeignKey(x => x.SeasonId);
            modelBuilder.Entity<MatchEvent>().HasOne(x => x.Person).WithMany(x => x.Events).HasForeignKey(x => x.PersonId);
            modelBuilder.Entity<MatchEvent>().HasOne(x => x.Match).WithMany(x => x.Events).HasForeignKey(x => x.MatchId);

            modelBuilder.Entity<PollAnswer>().HasOne(x => x.Poll).WithMany(x => x.Answers).HasForeignKey(x => x.PollId);
            modelBuilder.Entity<PollAnswerUser>().HasOne(x => x.Poll).WithMany().HasForeignKey(x => x.PollId);
            modelBuilder.Entity<PollAnswerUser>().HasKey(t => new {t.PollAnswerId, t.UserId});

            //research todo maybe it doesn't need https://docs.microsoft.com/en-us/aspnet/core/migration/1x-to-2x/identity-2x
            modelBuilder.Entity<User>()
                .HasMany(e => e.Claims)
                .WithOne()
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(e => e.Logins)
                .WithOne()
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(e => e.Roles)
                .WithOne()
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            //end research

            modelBuilder.Entity<MaterialComment>().HasQueryFilter(x => !x.Deleted);

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
            modelBuilder.Entity<MaterialCategory>().ToTable("MaterialCategories");
            modelBuilder.Entity<MaterialComment>().ToTable("MaterialComments");
            modelBuilder.Entity<Wish>().ToTable("Wishes");
            modelBuilder.Entity<ForumSection>().ToTable("ForumSections");
            modelBuilder.Entity<ForumSubsection>().ToTable("ForumSubsections");
            modelBuilder.Entity<ForumTheme>().ToTable("ForumThemes");
            modelBuilder.Entity<ForumMessage>().ToTable("ForumMessages");
            modelBuilder.Entity<RoleGroup>().ToTable("RoleGroups");
            modelBuilder.Entity<RoleRoleGroup>().ToTable("RoleRoleGroups");
            modelBuilder.Entity<PrivateMessage>().ToTable("PrivateMessages");
            modelBuilder.Entity<Club>().ToTable("Clubs");
            modelBuilder.Entity<ChatMessage>().ToTable("ChatMessages");
            modelBuilder.Entity<Match>().ToTable("Matches");
            modelBuilder.Entity<HelpEntity>().ToTable("HelpEntities");
            modelBuilder.Entity<Person>().ToTable("Persons");
            modelBuilder.Entity<Season>().ToTable("Seasons");
            modelBuilder.Entity<Stadium>().ToTable("Stadiums");
            modelBuilder.Entity<UserConfig>().ToTable("UserConfigs");
            modelBuilder.Entity<Transfer>().ToTable("Transfers");
            modelBuilder.Entity<CommentVote>().ToTable("CommentVotes");
            modelBuilder.Entity<Injury>().ToTable("Injuries");
            modelBuilder.Entity<Loan>().ToTable("Loans");
            modelBuilder.Entity<MatchEvent>().ToTable("MatchEvents");
            modelBuilder.Entity<Notification>().ToTable("Notifications");

            modelBuilder.ConfigurePersistedGrantContext(_operationalStoreOptions.Value);

        }

        public Task<int> SaveChangesAsync()
        {
            return base.SaveChangesAsync();
        }

        public DbSet<PersistedGrant> PersistedGrants { get; set; }
        public DbSet<DeviceFlowCodes> DeviceFlowCodes { get; set; }
    }
}
