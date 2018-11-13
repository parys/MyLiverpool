using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Data.ResourceAccess
{
    public class DatabaseInitializer
    {
        private readonly LiverpoolContext _context;
        private const int CountNews = 100;
        private const int CountBlog = 100;
        private const int CountNewsComments = 100;
        private const int CountBlogComments = 100;
        private const int CountUsers = 2;
        private const MaterialType NewsType = MaterialType.News;
        private const MaterialType BlogType = MaterialType.Blogs;
        private const string DefaultPhotoPath = "/content/avatars/default.png";

        public DatabaseInitializer(LiverpoolContext context)
        {
            this._context = context;
        }

        public async void Seed(bool migrator = false)
        {
            if (_context.Roles.Any()) return;

            await InitializeRoles();
            await InitializeRoleGroups();
            await InitRoleRoleGroups();

            if (!migrator)
            {
                await InitUsers();

                await InitializeNewsCategories();
                await InitializeNews();
                await InitializeNewsComments();

                await InitializeBlogCategories();
                await InitializeBlog();
                await InitializeBlogComments();

                await InitializePrivateMessages();

                await InitializeForumSections();
                await InitializeForumSubsections();
                await InitializeForumThemes();
            }

            await InitStadiums();
            await InitSeasons();
            await InitClubs();
            await InitMatches();
            await InitPersonsAsync();

          //  await AddApplication();
        }

        #region roles
        private async Task InitializeRoleGroups()
        {
            if(_context.RoleGroups.Any()) return;
           
            var roleGroups = new List<RoleGroup>()
            {
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Admin.ToString(),//1
                    RussianName = RoleGroupsEnum.Admin.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.AdminAssistance.ToString(),//2
                    RussianName = RoleGroupsEnum.AdminAssistance.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.MainNewsmaker.ToString(), //3
                    RussianName = RoleGroupsEnum.MainNewsmaker.GetNameAttribute()
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Newsmaker.ToString(),//4
                    RussianName = RoleGroupsEnum.Newsmaker.GetNameAttribute()
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Editor.ToString(),//5
                    RussianName = RoleGroupsEnum.Editor.GetNameAttribute()
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.MainEditor.ToString(),//6
                    RussianName = RoleGroupsEnum.MainEditor.GetNameAttribute()
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Intern.ToString(),//7
                    RussianName = RoleGroupsEnum.Intern.GetNameAttribute()
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Moderator.ToString(),//8
                    RussianName = RoleGroupsEnum.Moderator.GetNameAttribute()
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.MainModerator.ToString(), //9
                    RussianName = RoleGroupsEnum.MainModerator.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Author.ToString(),//10
                    RussianName = RoleGroupsEnum.Author.GetNameAttribute()
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Simple.ToString(), //11
                    RussianName = RoleGroupsEnum.Simple.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.ForumModerator.ToString(),//12
                    RussianName = RoleGroupsEnum.ForumModerator.GetNameAttribute()
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.ForumMainModerator.ToString(), //13
                    RussianName = RoleGroupsEnum.ForumMainModerator.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Veteran.ToString(), //14
                    RussianName = RoleGroupsEnum.Veteran.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Proven.ToString(), //15
                    RussianName = RoleGroupsEnum.Proven.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.ForecastLeader.ToString(), //16
                    RussianName = RoleGroupsEnum.ForecastLeader.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Leader.ToString(), //17
                    RussianName = RoleGroupsEnum.Leader.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Basic.ToString(), //18
                    RussianName = RoleGroupsEnum.Basic.GetNameAttribute(),
                },
                new RoleGroup()
                {
                    Name = RoleGroupsEnum.Profi.ToString(), //19
                    RussianName = RoleGroupsEnum.Profi.GetNameAttribute(),
                },
            };
            roleGroups.ForEach(x => _context.RoleGroups.Add(x));
            await _context.SaveChangesAsync();
        }

        private async Task InitializeRoles()
        {
            if (_context.Roles.Any()) return;
            var roleStore = new RoleStore<Role, LiverpoolContext, int>(_context);
            var roleManager = new RoleManager<Role>(roleStore, null, null, null, null);

            var roles = new List<Role>()
            {
                new Role() //0
                {
                    Name = RolesEnum.Simple.ToString(),
                },
                new Role()//1
                {
                    Name = RolesEnum.NewsStart.ToString(),
                },
                new Role() //2
                {
                    Name = RolesEnum.NewsFull.ToString(),
                },
                new Role()//3
                {
                    Name = RolesEnum.BlogStart.ToString(),
                },
                new Role() //4
                {
                    Name = RolesEnum.BlogFull.ToString(),
                },
                new Role()//5
                {
                    Name = RolesEnum.UserStart.ToString(),
                },
                new Role()//6
                {
                    Name = RolesEnum.UserFull.ToString(),
                },
                new Role()//7
                {
                    Name = RolesEnum.AdminStart.ToString(),
                },
                new Role()//8
                {
                    Name = RolesEnum.AdminFull.ToString(),
                },
                new Role()//9
                {
                    Name = RolesEnum.InfoStart.ToString(),
                },
                new Role()//10
                {
                    Name = RolesEnum.InfoFull.ToString(),
                },
                new Role()//11
                {
                    Name = RolesEnum.Intern.ToString(),
                },
            };
            //  roles.ForEach(x => _context.RoleGroups.Add(x));
            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }
           // roles.ForEach(x => new Task(() => roleManager.CreateAsync(x)));
            //roleManager.Create(new Role { Name = RolesEnum.User.ToString() });
            await  _context.SaveChangesAsync();
        }

        private async Task InitRoleRoleGroups()
        {
            if (_context.RoleRoleGroups.Any()) return;

            var adminRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.AdminFull.ToString()); //1
            var adminAssistanceRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.AdminStart.ToString());
            var moderatorRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.UserStart.ToString());//3
            var mainModeratorRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.UserFull.ToString());
            var authorRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.BlogStart.ToString());//5
            var mainAuthorRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.BlogFull.ToString());
            var internRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.Intern.ToString());
            var mainForumRole = _context.Roles.First(x => x.Name == RolesEnum.InfoFull.ToString());//7
            var forumRole = _context.Roles.First(x => x.Name == RolesEnum.InfoStart.ToString());
            var mainNewsmakeRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.NewsFull.ToString());//9
            var newsmakerRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.NewsStart.ToString());
            var simpleRole = await _context.Roles.FirstAsync(x => x.Name == RolesEnum.Simple.ToString());//11

            var adminGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Admin.ToString()); //1
            var adminAssistGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.AdminAssistance.ToString()); 
            var mainNewsGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.MainNewsmaker.ToString()); //3
            var newsGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Newsmaker.ToString()); 
            var editorGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Editor.ToString()); //5
            var mainEditorGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.MainEditor.ToString());
            var internGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Intern.ToString()); //7 
            var moderatorGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Moderator.ToString());
            var mainModeratorGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.MainModerator.ToString());//9 
            var authorGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Author.ToString()); 
            var simpleGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Simple.ToString()); //11
            var forumModeratorGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.ForumModerator.ToString()); 
            var forumMainModeratorGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.ForumMainModerator.ToString()); //13
            var veteranGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Veteran.ToString()); 
            var provenGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Proven.ToString()); //15
            var forecastLeaderGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.ForecastLeader.ToString()); 
            var historicExpertGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Leader.ToString()); //17
            var basicGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Basic.ToString()); 
            var profiGroup = await _context.RoleGroups.FirstAsync(x => x.Name == RoleGroupsEnum.Profi.ToString()); //19
            

            #region adminRoleRoleGroups
            var adminRoleGroups = new List<RoleRoleGroup>
            {
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = adminRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = adminAssistanceRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = moderatorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = mainModeratorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = authorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = internRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = mainAuthorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = mainNewsmakeRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = newsmakerRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = forumRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminGroup.Id,
                    RoleId = mainForumRole.Id
                },
            };
            adminRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region AdminAssistance

            var adminAssistanceRoleGroups = new List<RoleRoleGroup>
            {
                new RoleRoleGroup()
                {
                    RoleGroupId = adminAssistGroup.Id,
                    RoleId = adminAssistanceRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminAssistGroup.Id,
                    RoleId = moderatorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminAssistGroup.Id,
                    RoleId = mainModeratorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminAssistGroup.Id,
                    RoleId = mainAuthorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminAssistGroup.Id,
                    RoleId = authorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminAssistGroup.Id,
                    RoleId = internRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminAssistGroup.Id,
                    RoleId = mainNewsmakeRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = adminAssistGroup.Id,
                    RoleId = newsmakerRole.Id
                }
            };
            adminAssistanceRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region mainNewsRoleGroups

            var mainNewsRoleGroups = new List<RoleRoleGroup>
            {                    
                new RoleRoleGroup()
                {
                    RoleGroupId = mainNewsGroup.Id,
                    RoleId = internRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = mainNewsGroup.Id,
                    RoleId = mainNewsmakeRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = mainNewsGroup.Id,
                    RoleId = newsmakerRole.Id
                }
            };
            mainNewsRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region newsRoleGroups

            var newsRoleGroups = new List<RoleRoleGroup>
            {                    
                new RoleRoleGroup()
                {
                    RoleGroupId = newsGroup.Id,
                    RoleId = internRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = newsGroup.Id,
                    RoleId = newsmakerRole.Id
                }
            };
            newsRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region editorRoleGroups

            var editorRoleGroups = new List<RoleRoleGroup>
            {
                new RoleRoleGroup()
                {
                    RoleGroupId = editorGroup.Id,
                    RoleId = internRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = editorGroup.Id,
                    RoleId = newsmakerRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = editorGroup.Id,
                    RoleId = authorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = editorGroup.Id,
                    RoleId = mainNewsmakeRole.Id
                }
            };
            editorRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region mainEditorRoleGroups

            var mainEditorRoleGroups = new List<RoleRoleGroup>
            {
                new RoleRoleGroup()
                {
                    RoleGroupId = mainEditorGroup.Id,
                    RoleId = internRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = mainEditorGroup.Id,
                    RoleId = newsmakerRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = mainEditorGroup.Id,
                    RoleId = authorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = mainEditorGroup.Id,
                    RoleId = mainNewsmakeRole.Id
                }
            };
            mainEditorRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region internRoleGroups

            var internRoleGroups = new List<RoleRoleGroup>
            {
                new RoleRoleGroup()
                {
                    RoleGroupId = internGroup.Id,
                    RoleId = internRole.Id
                }
            };
            internRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region moderatorRoleGroups

            var moderatorRoleGroups = new List<RoleRoleGroup>
            {
                new RoleRoleGroup()
                {
                    RoleGroupId = moderatorGroup.Id,
                    RoleId = moderatorRole.Id
                }
            };
            moderatorRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region mainModeratorRoleGroups

            var mainModeratorRoleGroups = new List<RoleRoleGroup>
            {
                 new RoleRoleGroup()
                {
                    RoleGroupId = mainModeratorGroup.Id,
                    RoleId = moderatorRole.Id
                },
                new RoleRoleGroup()
                {
                    RoleGroupId = mainModeratorGroup.Id,
                    RoleId = mainModeratorRole.Id
                }
            };
            mainModeratorRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region authorRoleGroups

            var authorRoleGroups = new List<RoleRoleGroup>
            {
                 new RoleRoleGroup()
                {
                    RoleGroupId = authorGroup.Id,
                    RoleId = authorRole.Id
                }
            };
            authorRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            #region simpleRoleGroups

            var simpleRoleGroups = new List<RoleRoleGroup>
            {
                new RoleRoleGroup()
                {
                    RoleGroupId = simpleGroup.Id,
                    RoleId = simpleRole.Id
                }
            };
            simpleRoleGroups.ForEach(x => _context.RoleRoleGroups.Add(x));
            #endregion

            await _context.SaveChangesAsync();
        }
        #endregion

        private async Task InitUsers()
        {
            if (_context.Users.Any()) return ;

            await InitializeAdmin();
            await InitializeDeletedUser();
            await InitializeSimpleUser();
            await InitializeModerator();
            await InitializeAuthor();
            await InitializeIntern();
            await InitializeEditor();
            await InitializeNewsmaker();
        }

        #region users 
        private async Task InitializeDeletedUser()
        {
            const string email = "deleted@deleted.com";

            var user = new User
            {
               // Id = -1,
                UserName = "deleted",
                Email = email,
                LastModified = DateTime.Now,
                RegistrationDate = DateTime.Now,
                RoleGroupId = (int)RoleGroupsEnum.Simple,
                LockoutEnabled = true,
                Photo = DefaultPhotoPath,
                EmailConfirmed = true,
            };

            var userManager = GetUserManager();

            await userManager.CreateAsync(user, "123456");
            await userManager.AddToRoleAsync(user, RolesEnum.Simple.ToString());
            await _context.SaveChangesAsync();
        }

        private async Task InitializeSimpleUser()
        {
            const string email = "user@user.com";

            var user = new User
            {
                UserName = "user",
                Email = email,
                LastModified = DateTime.Now,
                RegistrationDate = DateTime.Now,
                RoleGroupId = (int)RoleGroupsEnum.Simple,
                LockoutEnabled = true,
                Photo = DefaultPhotoPath,
                EmailConfirmed = true,
            };

            var userManager = GetUserManager();

            await userManager.CreateAsync(user, "123456");
            await userManager.AddToRoleAsync(user, RolesEnum.Simple.ToString());
            await _context.SaveChangesAsync();
        }

        private async Task InitializeAdmin()
        {
            const string email = "a@a.c";

            var user = new User
            {
                UserName = "admin",
                Email = email,
                LastModified = DateTime.Now,
                RegistrationDate = DateTime.Now,
                Birthday = DateTime.Now,
                RoleGroupId = (int)RoleGroupsEnum.Admin,
                Photo = "content/avatars/0/755939.jpeg",
                EmailConfirmed = true,
            };

            var userManager = GetUserManager();

            await userManager.CreateAsync(user, "123qwe");
            var adminRoles = GetRoleNamesByRoleGroupId(user.RoleGroupId);

            await userManager.AddToRolesAsync(user, adminRoles);
          //  await _context.SaveChangesAsync();

        }

        private async Task InitializeModerator()
        {
            const string email = "moderator@a.c";

            var user = new User
            {
                UserName = "moderator",
                Email = email,
                LastModified = DateTime.Now,
                RegistrationDate = DateTime.Now,
                Birthday = DateTime.Now,
                RoleGroupId = (int)RoleGroupsEnum.Moderator,
                LockoutEnabled = true,
                Photo = DefaultPhotoPath,
                EmailConfirmed = true,
            };

            var userManager = GetUserManager();

            await userManager.CreateAsync(user, "123456");
            var adminRoles = GetRoleNamesByRoleGroupId(user.RoleGroupId);

            await userManager.AddToRolesAsync(user, adminRoles);
            await _context.SaveChangesAsync();
        }

        private async Task InitializeAuthor()
        {
            const string email = "author@a.c";

            var user = new User
            {
                UserName = "author",
                Email = email,
                LastModified = DateTime.Now,
                RegistrationDate = DateTime.Now,
                Birthday = DateTime.Now,
                RoleGroupId = (int)RoleGroupsEnum.Author,
                LockoutEnabled = true,
                Photo = DefaultPhotoPath,
                EmailConfirmed = true,
            };

            var userManager = GetUserManager();

            await userManager.CreateAsync(user, "123456");
            var adminRoles = GetRoleNamesByRoleGroupId(user.RoleGroupId);
            await userManager.AddToRolesAsync(user, adminRoles);
            await _context.SaveChangesAsync();
        }

        private async Task InitializeIntern()
        {
            const string email = "Intern@a.c";

            var user = new User
            {
                UserName = "Intern",
                Email = email,
                LastModified = DateTime.Now,
                RegistrationDate = DateTime.Now,
                Birthday = DateTime.Now,
                RoleGroupId = (int)RoleGroupsEnum.Intern,
                LockoutEnabled = true,
                Photo = DefaultPhotoPath,
                EmailConfirmed = true,
            };

            var userManager = GetUserManager();

            await userManager.CreateAsync(user, "123456");
            var adminRoles = GetRoleNamesByRoleGroupId(user.RoleGroupId);

            await userManager.AddToRolesAsync(user, adminRoles);
            await _context.SaveChangesAsync();

        }

        private async Task InitializeEditor()
        {
            const string email = "Editor@a.c";

            var user = new User
            {
                UserName = "Editor",
                Email = email,
                LastModified = DateTime.Now,
                RegistrationDate = DateTime.Now,
                Birthday = DateTime.Now,
                RoleGroupId = (int)RoleGroupsEnum.Editor,
                LockoutEnabled = true,
                Photo = DefaultPhotoPath,
                EmailConfirmed = true,
            };

            var userManager = GetUserManager();

            await userManager.CreateAsync(user, "123456");
            var adminRoles = GetRoleNamesByRoleGroupId(user.RoleGroupId);
            await userManager.AddToRolesAsync(user, adminRoles);
            await _context.SaveChangesAsync();
        }

        private IEnumerable<string> GetRoleNamesByRoleGroupId(int id)
        {
            return _context.RoleGroups.Include(x => x.RoleGroups).ThenInclude(x => x.Role).First(x => x.Id == id).RoleGroups.Select(r => r.Role.Name).ToList();
        }

        private async Task InitializeNewsmaker()
        {
            const string email = "Newsmaker@a.c";

            var user = new User
            {
                UserName = "newsmaker",
                Email = email,
                LastModified = DateTime.Now,
                RegistrationDate = DateTime.Now,
                Birthday = DateTime.Now,
                RoleGroupId = (int)RoleGroupsEnum.Newsmaker,
                LockoutEnabled = true,
                Photo = DefaultPhotoPath,
                EmailConfirmed = true,
            };
            
            var userManager = GetUserManager();

            await userManager.CreateAsync(user, "123456");
            var adminRoles = GetRoleNamesByRoleGroupId(user.RoleGroupId);
            await userManager.AddToRolesAsync(user, adminRoles);
            await _context.SaveChangesAsync();

        }
        #endregion

        #region forum
        private async Task InitializeForumSections()
        {
            if (_context.ForumSections.Any()) return;
            var forumSection1 = new ForumSection()
            {
                Name = "section 1"
            };
            var forumSection2 = new ForumSection()
            {
                Name = "section 2"
            };
            _context.ForumSections.Add(forumSection1);
            _context.ForumSections.Add(forumSection2);
            await _context.SaveChangesAsync();
        }

        private async Task InitializeForumSubsections()
        {
            if (_context.ForumSubsections.Any()) return;
            var forumSubsection1 = new ForumSubsection()
            {
                Name = "subsection 1",
                Description = "subsection description 1",
                SectionId = 1,

            };
            var forumSubsection2 = new ForumSubsection()
            {
                Name = "subsection 2",
                Description = "subsection description 2",
                SectionId = 1
            };
            _context.ForumSubsections.Add(forumSubsection1);
            _context.ForumSubsections.Add(forumSubsection2);
            await _context.SaveChangesAsync();
        }

        private async Task InitializeForumThemes()
        {
            if (_context.ForumThemes.Any()) return;
            var themes = new List<ForumTheme>();
            for (int i = 0; i < 16; i++)
            {
                var messages = new List<ForumMessage>();
                for (int j = 0; j < 23; j++)
                {
                    var message = new ForumMessage()
                    {
                        Message = "message" + i,
                        AdditionTime = DateTime.Now.AddHours(-20 + i),
                        AuthorId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                        LastModifiedTime = DateTime.Now.AddHours(-20 + i),
                        ThemeId = 1,
                    };
                    messages.Add(message);
                }
                var userId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id);
                var forumTheme = new ForumTheme()
                {
                    Name = "theme " + i,
                    Description = "theme description " + i,
                    SubsectionId = 1,
                    LastMessageAdditionTime = DateTime.Today,
                    Messages = messages,
                    AuthorId = userId,
                    LastAnswerUserId = userId
                };
                themes.Add(forumTheme);
            }
        
            themes.ForEach(x => _context.ForumThemes.Add(x));
            await _context.SaveChangesAsync();
        }
        #endregion

        #region news
        private async Task InitializeNewsCategories()
        {
            if (_context.MaterialCategories.Any()) return;
            var categories = new List<MaterialCategory>()
            {
                new MaterialCategory()
                {
                    Name = "news category 1",
                    Description = "new category description 1",
                    MaterialType = NewsType,
                },
                new MaterialCategory()
                {
                    Name = "news category 2",
                    Description = "new category description 2",
                    MaterialType = NewsType,
                },
                new MaterialCategory()
                {
                    Name = "news category 3",
                    Description = "new category description 3",
                    MaterialType = NewsType,
                },
            };
            categories.ForEach(x => _context.MaterialCategories.Add(x));
            await _context.SaveChangesAsync();
        }

        private async Task InitializeNews()
        {
            if (_context.Materials.Any()) return;
            var news = new List<Material>();
            var randomizer = new Random(44);

            for (int i = 0; i < CountNews; i++)
            {
                news.Add(new Material()
                {
                    CategoryId = i % 2 == 0 ? 1 : 2,
                    AdditionTime = DateTime.Now.AddHours(randomizer.NextDouble() * -CountNews),
                    AuthorId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    Brief = "brief" + i,
                    CanCommentary = i % 2 == 0,
                    Type = NewsType,
                    LastModified = DateTime.Now.AddDays(randomizer.NextDouble() * -CountNews),
                    Message = @"<div align='center'><img src='http://s4.hostingkartinok.com/uploads/images/2013/07/5513d5a371375d0047370d9727e4ecc2.jpg' border ='0' alt ='/></div>
<br /><br /> <b>100 дней, которые потрясли Коп</b> - это список моментов из истории ""Ливерпуля"", которые оказали значительное влияние на клуб и его болельщиков составленный самими
болельщиками клуба. <br /><br /> Фантастическая победа на ""Гудисон Парк"" в Раунде 4, Кубка Англии против ""Эвертона"" - 4:0. ""Ливерпуль"" выступает во втором дивизионе, ""Эвертон""
в первом. <br /><br /><div align='center'><img src='http://s3.hostingkartinok.com/uploads/images/2013/07/8e5d4bee9b2813244bc5c0fe10a5360c.jpg' border='0' alt=''/></div> <br /><br /> 
<i>Конная полиция пытается сдержать толпу болельщиков, после того как было объявлено что продажа билетов на кубковый матч ""Эвертон"" - ""Ливерпуль"" закончилась. </i> <br /><br /> 
Интерес к этому матчу был просто огромным.Болельщиков обоих клубов не смущал тот факт, что ""Ливерпуль"" проводил один из самых худших сезонов в своей истории, находясь ниже середины
в турнирной таблице Второго дивизиона, а ""Ириски"" на тот момент занимали 6 место в Первом дивизионе. <br /><br /> Посещаемость этого матча является рекордной для кубковых встреч 
между ""Эвертоном"" и ""Ливерпулем"" за всю историю Дерби в городе. <br /><br /> ""Сенсация сезона"". С такими заголовками вышли практически все футбольные печатные издания в Англии.
тем более что ""Ливерпуль"" под руководством Дона Уэлша до этой встречи не одержал ни одной выездной победы в сезоне. <br /><br /> <div align='center'><img 
src='http://s4.hostingkartinok.com/uploads/images/2013/07/8a7fed2ee9f513c0e7565575ca5f0936.jpg' border='0' alt=''/></div> <br /><br /> Билли ""Лидделпуль"" Лидделл,
открывший счет на 18-й минуте, называл свой забитый мяч в этой игре - самым величайшим голом из <b>228</b> забитых за карьеру в клубе. <br /> <div align='center'> <br /> 
<img src='http://s5.hostingkartinok.com/uploads/images/2013/07/43330ecc610bf23dadc3740350f0a1c1.jpg' border='' alt=''/></div> <br /><br /> <i>""Дон Уэлш, был так доволен нашей
игрой и результатом - что выдал каждому из нас по 10 шиллингов""</i> - вспоминал затем Билли Лидделл. <br /><br /> <div align='center'><b>29</b> января 1955 года. Кубок Англии.
Раунд 4. ""Гудисон Парк"" 72 000 зр. <br /><br /> ""Эвертон"" - ""Ливерпуль"" - 0:4 <br /><br /> голы:Лидделл(18)Экурт(29)Эванс(57)(75) <br /><br /> <b>""Ливерпуль""</b>:Дуг
Радхэм,Рэй Ламберт,Ронни Моран,Рой Сондерс,Лори Хьюз,Джефф Твентимен,Брайан Джексон,Эрик Андерсон,Билли Лидделл,Джон Эванс,Алан Экурт. </div> <br /><br /> <div align='center'>
<img src='http://s6.hostingkartinok.com/uploads/images/2013/07/e3e724e232b0d518e419a4baf5fbee64.jpg' border='0' alt=''/></div> <br /><br /> <div align='center'>
<img src='http://s4.hostingkartinok.com/uploads/images/2013/07/78a9a6f0f38b0d8d8641aad4dca62f5e.jpg' border='0' alt=''/></div> <br /><br /> <div align='center'>
<img src='http://s6.hostingkartinok.com/uploads/images/2013/07/642fbd99157b7b76679362ce838bf151.jpg' border='0' alt=''/></div> <br /><br /> <div align='center'>
<img src= 'http://s3.hostingkartinok.com/uploads/images/2013/07/fc66688ba1ecc06dfe20bc6688dacc52.jpg' border='0' alt=''/></div> <br /><br /> <br /><br /> Фотографии по материалам <i><b>britishpathe.com, lfchistory.net </b></i>",
                    OnTop = i % 48 == 0,
                    PhotoPath = "content/images/default.jpg",
                    Pending = i % 5 == 0,
                    Reads = 0,
                    Source = "123",
                    Title = "news" + i
                });
            }

            news.ForEach(x => _context.Materials.Add(x));
            await _context.SaveChangesAsync();
        }

        private async Task InitializeNewsComments()
        {
            if (_context.MaterialComments.Any()) return;
            var newsComments = new List<MaterialComment>();
            var random = new Random((int)DateTime.UtcNow.Ticks);
            for (int i = 0; i < CountNewsComments; i++)
            {
                var comment = new MaterialComment()
                {
                    MaterialId = new Random().Next(_context.Materials.First(x => x.Type == NewsType).Id, _context.Materials.Last(x => x.Type == NewsType).Id),
                    AdditionTime = DateTime.Now.AddDays(random.NextDouble() * 10),
                    Answer = i % 5 == 0 ? "answer" : string.Empty,
                    AuthorId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    Message = "message " + i,
                    Pending = (i + 3) % 5 == 0,
                    Type = CommentType.News,
                    LastModified = DateTime.Now,
                };
                if (i % 3 == 0)
                {
                    comment.Children = new List<MaterialComment>()
                    {
                        new MaterialComment()
                        {
                            ParentId = i + 1,
                            Pending = false,
                            MaterialId = comment.MaterialId,
                            AdditionTime = DateTime.Now,
                    AuthorId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                            Message = "comment inside",
                            Type = CommentType.News,
                            LastModified = DateTime.Now,
                        }
                    };
                    i += 1;
                }
                newsComments.Add(comment);
            }

            newsComments.ForEach(x => _context.MaterialComments.Add(x));
            await _context.SaveChangesAsync();

            var commentFirstNews = new MaterialComment()
            {
                Pending = false,
                MaterialId = _context.Materials.First(x => x.Type == NewsType).Id,
                AdditionTime = DateTime.Now,
                AuthorId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                Message = "comment first",
                Type = CommentType.News,
                LastModified = DateTime.Now,
                Children = new List<MaterialComment>()
                {
                    new MaterialComment()
                    {
                        ParentId = CountNews + 1,
                        Pending = false,
                                MaterialId = _context.Materials.First(x => x.Type == NewsType).Id,
                        AdditionTime = DateTime.Now,
                    AuthorId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                        Message = "comment second inside",
                        Type = CommentType.News,
                        LastModified = DateTime.Now,
                        Children = new List<MaterialComment>()
                        {
                            new MaterialComment()
                            {
                                ParentId = CountNews + 2,
                                Pending = false,
                                MaterialId = _context.Materials.First(x => x.Type == NewsType).Id,
                                AdditionTime = DateTime.Now,
                    AuthorId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                                Message = "comment three inside",
                                Type = CommentType.News,
                                LastModified = DateTime.Now,
                            }
                        }
                    }
                }
            };

            _context.MaterialComments.Add(commentFirstNews);
            await _context.SaveChangesAsync();
        }
        #endregion


        #region blog //todo not initing
        private async Task InitializeBlogCategories()
        {
            var type = BlogType;
            var categories = new List<MaterialCategory>()
            {
                new MaterialCategory()
                {
                    Name = "blog category 1",
                    Description = "new category description 1",
                    MaterialType = type,
                },
                new MaterialCategory()
                {
                    Name = "blog category 2",
                    Description = "new category description 2",
                    MaterialType = type,
                },
                new MaterialCategory()
                {
                    Name = "blog category 3",
                    Description = "new category description 3",
                    MaterialType = type,
                },
            };
            categories.ForEach(x => _context.MaterialCategories.Add(x));
            await _context.SaveChangesAsync();
        }

        private async Task InitializeBlog()
        {
            var type = BlogType;
            var news = new List<Material>();
            var randomizer = new Random(44);

            for (int i = 0; i < CountNews; i++)
            {
                news.Add(new Material()
                {
                    CategoryId = i % 2 == 0 ? 1 : 2,
                    AdditionTime = DateTime.Now.AddHours(randomizer.NextDouble() * -CountNews),
                    AuthorId =1,// i % 3 + 1,
                    Brief = "brief" + i,
                    CanCommentary = i % 2 == 0,
                    Type = type,
                    LastModified = DateTime.Now.AddDays(randomizer.NextDouble() * -CountNews),
                    Message = @"<div align='center'><img src='http://s4.hostingkartinok.com/uploads/images/2013/07/5513d5a371375d0047370d9727e4ecc2.jpg' border ='0' alt ='/></div>
<br /><br /> <b>100 дней, которые потрясли Коп</b> - это список моментов из истории ""Ливерпуля"", которые оказали значительное влияние на клуб и его болельщиков составленный самими
болельщиками клуба. <br /><br /> Фантастическая победа на ""Гудисон Парк"" в Раунде 4, Кубка Англии против ""Эвертона"" - 4:0. ""Ливерпуль"" выступает во втором дивизионе, ""Эвертон""
в первом. <br /><br /><div align='center'><img src='http://s3.hostingkartinok.com/uploads/images/2013/07/8e5d4bee9b2813244bc5c0fe10a5360c.jpg' border='0' alt=''/></div> <br /><br /> 
<i>Конная полиция пытается сдержать толпу болельщиков, после того как было объявлено что продажа билетов на кубковый матч ""Эвертон"" - ""Ливерпуль"" закончилась. </i> <br /><br /> 
Интерес к этому матчу был просто огромным.Болельщиков обоих клубов не смущал тот факт, что ""Ливерпуль"" проводил один из самых худших сезонов в своей истории, находясь ниже середины
в турнирной таблице Второго дивизиона, а ""Ириски"" на тот момент занимали 6 место в Первом дивизионе. <br /><br /> Посещаемость этого матча является рекордной для кубковых встреч 
между ""Эвертоном"" и ""Ливерпулем"" за всю историю Дерби в городе. <br /><br /> ""Сенсация сезона"". С такими заголовками вышли практически все футбольные печатные издания в Англии.
тем более что ""Ливерпуль"" под руководством Дона Уэлша до этой встречи не одержал ни одной выездной победы в сезоне. <br /><br /> <div align='center'><img 
src='http://s4.hostingkartinok.com/uploads/images/2013/07/8a7fed2ee9f513c0e7565575ca5f0936.jpg' border='0' alt=''/></div> <br /><br /> Билли ""Лидделпуль"" Лидделл,
открывший счет на 18-й минуте, называл свой забитый мяч в этой игре - самым величайшим голом из <b>228</b> забитых за карьеру в клубе. <br /> <div align='center'> <br /> 
<img src='http://s5.hostingkartinok.com/uploads/images/2013/07/43330ecc610bf23dadc3740350f0a1c1.jpg' border='' alt=''/></div> <br /><br /> <i>""Дон Уэлш, был так доволен нашей
игрой и результатом - что выдал каждому из нас по 10 шиллингов""</i> - вспоминал затем Билли Лидделл. <br /><br /> <div align='center'><b>29</b> января 1955 года. Кубок Англии.
Раунд 4. ""Гудисон Парк"" 72 000 зр. <br /><br /> ""Эвертон"" - ""Ливерпуль"" - 0:4 <br /><br /> голы:Лидделл(18)Экурт(29)Эванс(57)(75) <br /><br /> <b>""Ливерпуль""</b>:Дуг
Радхэм,Рэй Ламберт,Ронни Моран,Рой Сондерс,Лори Хьюз,Джефф Твентимен,Брайан Джексон,Эрик Андерсон,Билли Лидделл,Джон Эванс,Алан Экурт. </div> <br /><br /> <div align='center'>
<img src='http://s6.hostingkartinok.com/uploads/images/2013/07/e3e724e232b0d518e419a4baf5fbee64.jpg' border='0' alt=''/></div> <br /><br /> <div align='center'>
<img src='http://s4.hostingkartinok.com/uploads/images/2013/07/78a9a6f0f38b0d8d8641aad4dca62f5e.jpg' border='0' alt=''/></div> <br /><br /> <div align='center'>
<img src='http://s6.hostingkartinok.com/uploads/images/2013/07/642fbd99157b7b76679362ce838bf151.jpg' border='0' alt=''/></div> <br /><br /> <div align='center'>
<img src= 'http://s3.hostingkartinok.com/uploads/images/2013/07/fc66688ba1ecc06dfe20bc6688dacc52.jpg' border='0' alt=''/></div> <br /><br /> <br /><br /> Фотографии по материалам <i><b>britishpathe.com, lfchistory.net </b></i>",
                    OnTop = i % 48 == 0,
                    PhotoPath = "content/images/default.jpg",
                    Pending = i % 5 == 0,
                    Reads = 0,
                    Source = "123",
                    Title = "blog" + i
                });
            }

            news.ForEach(x => _context.Materials.Add(x));
            await _context.SaveChangesAsync();
        }

        private async Task InitializeBlogComments()
        {
            const CommentType type = CommentType.Blogs;
            var newsComments = new List<MaterialComment>();
            var random = new Random((int)DateTime.UtcNow.Ticks);
            for (int i = 0; i < CountNewsComments; i++)
            {
                var comment = new MaterialComment()
                {
                    MaterialId = _context.Materials.First(x => x.Type == NewsType).Id,
                    AdditionTime = DateTime.Now.AddDays(random.NextDouble() * 10),
                    Answer = i % 5 == 0 ? "answer" : string.Empty,
                    AuthorId = random.Next(1, CountUsers),
                    Message = "message " + i,
                    Pending = (i + 3) % 5 == 0,
                    Type = type,
                    LastModified = DateTime.Now,
                };
                if (i % 3 == 0)
                {
                    comment.Children = new List<MaterialComment>()
                    {
                        new MaterialComment()
                        {
                            ParentId = i + 1,
                            Pending = false,
                            MaterialId = comment.MaterialId,
                            AdditionTime = DateTime.Now,
                            AuthorId = random.Next(1, CountUsers),
                            Message = "comment inside",
                            Type = type,
                            LastModified = DateTime.Now,
                        }
                    };
                    i += 1;
                }
                newsComments.Add(comment);
            }

            newsComments.ForEach(x => _context.MaterialComments.Add(x));
            await _context.SaveChangesAsync();

            var commentFirstNews = new MaterialComment()
            {
                Pending = false,
                MaterialId = _context.Materials.First(x => x.Type == NewsType).Id,
                AdditionTime = DateTime.Now,
                AuthorId = 1,
                Message = "comment first",
                Type = type,
                LastModified = DateTime.Now,
                Children = new List<MaterialComment>()
                {
                    new MaterialComment()
                    {
                        ParentId = CountNews + 1,
                        Pending = false,
                                MaterialId = _context.Materials.First(x => x.Type == NewsType).Id,
                        AdditionTime = DateTime.Now,
                        AuthorId = 2,
                        Message = "comment second inside",
                        Type = type,
                        LastModified = DateTime.Now,
                        Children = new List<MaterialComment>()
                        {
                            new MaterialComment()
                            {
                                ParentId = CountNews + 2,
                                Pending = false,
                                MaterialId = _context.Materials.First(x => x.Type == NewsType).Id,
                                AdditionTime = DateTime.Now,
                                AuthorId = 3,
                                Message = "comment three inside",
                                Type = type,
                                LastModified = DateTime.Now,
                            }
                        }
                    }
                }
            };

            _context.MaterialComments.Add(commentFirstNews);
            await _context.SaveChangesAsync();
        }
        #endregion // not inititng

        private async Task InitializePrivateMessages()
        {
            if (_context.PrivateMessages.Any()) return;
            var pms = new List<PrivateMessage>()
            {
                new PrivateMessage()
                {
                    SenderId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    ReceiverId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    IsRead = false,
                    SentTime = DateTime.Now.AddDays(-5),
                    Title = "title 1",
                    Message = "mess 1"
                },
                new PrivateMessage()
                {
                    SenderId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    ReceiverId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    IsRead = true,
                    SentTime = DateTime.Now.AddDays(-3),
                    Title = "title 2",
                    Message = "mess 2"
                },
                new PrivateMessage()
                {
                    SenderId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    ReceiverId =new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    IsRead = false,
                    SentTime = DateTime.Now.AddDays(-5),
                    Title = "title 3",
                    Message = "mess 3"
                },
                new PrivateMessage()
                {
                    SenderId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    ReceiverId = new Random().Next(_context.Users.First().Id, _context.Users.Last().Id),
                    IsRead = true,
                    SentTime = DateTime.Now.AddDays(-3),
                    Title = "title 4",
                    Message = "mess 4"
                },
            };

            pms.ForEach(x => _context.PrivateMessages.Add(x));
            await _context.SaveChangesAsync();
        }

      //  private async Task AddApplication()
        //{
            //var applications = _context.Set<OpenIddictApplication<int>>();
            //if (applications.Any()) return;

            //var app = new OpenIddictApplication<int>() 
            //{
            //    ClientId = "client_id3",
            //    ClientSecret = "client_secret44",
            //    Type = OpenIddictConstants.ClientTypes.Public,
            //  //  Id = Guid.NewGuid().ToString(),
            //    DisplayName = "MVC Core client application",
            //    RedirectUris = "http://localhost:1669/",
            //    PostLogoutRedirectUris = "http://localhost:1669/",
            //};
            //applications.Add(app);

            //app = new OpenIddictApplication<int>()
            //{
            //    ClientId = "client_id_swagger",
            //    ClientSecret = "client_secret_swagger",
            //    Type = OpenIddictConstants.ClientTypes.Public,
            //    //Id = Guid.NewGuid().ToString(),
            //    DisplayName = "Swagger client application",
            //    RedirectUris = "http://localhost:1669/swagger/o2c.html",
            //    PostLogoutRedirectUris = "http://localhost:1669/swagger/index.html",
            //};
            //applications.Add(app);
            //await _context.SaveChangesAsync();
        //}

        #region season-stadium-club-match
        private async Task InitSeasons()
        {
            var season = new Season()
            {
                StartSeasonYear = DateTime.Today.AddYears(-1).Year
            };
            await _context.Seasons.AddAsync(season);
            await _context.SaveChangesAsync();
        }

        private async Task InitStadiums()
        {
            var stadiums = new Stadium()
            {
                City = "city",
                Name = "name"
            };
            await _context.Stadiums.AddAsync(stadiums);
            await _context.SaveChangesAsync();
        }

        private async Task InitClubs()
        {
            var clubs = _context.Set<Club>();
            if (clubs.Any()) return;

            var club = new Club
            {
                EnglishName = "Liverpool",
                Logo = "/content/logos/0/liverpool.png",
                Name = "Ливерпуль",
                StadiumId = 1
            };
            clubs.Add(club);
            var club1 = new Club
            {
                EnglishName = "Arsenal",
                Logo = "/content/logos/0/arsenal.png",
                Name = "Арсенал",
                StadiumId = 1
            };
            clubs.Add(club1);
            var club2 = new Club 
            {
                EnglishName = "Everton",
                Logo = "/content/logos/0/everton.png",
                Name = "Эвертон",
                StadiumId = 1
            };
            clubs.Add(club2);
            var club3 = new Club 
            {
                EnglishName = "Manchester City",
                Logo = "/content/logos/0/manchestercity.png",
                Name = "Манчестер Сити",
                StadiumId = 1
            };
            clubs.Add(club3);

            await _context.SaveChangesAsync();
        }

        private async Task InitMatches()
        {
            var matches = _context.Set<Match>();
            if (matches.Any()) return;

            var match = new Match
            {
                ClubId = 2,
                DateTime = DateTimeOffset.Now,
                StadiumId = 1,
                IsHome = false,
                MatchType = MatchTypeEnum.Epl,
                //Score = "3-3",
                SeasonId = 1
            };

            var match2 = new Match
            {
                ClubId = 2,
                DateTime = DateTimeOffset.Now.AddDays(55),
                StadiumId = 1,
                IsHome = false,
                MatchType = MatchTypeEnum.Epl,
                SeasonId = 1
            };

            matches.Add(match);
            matches.Add(match2);

            await _context.SaveChangesAsync();
        }
#endregion

        private async Task InitPersonsAsync()
        {
            if(_context.Persons.Any()) return;

            var person = new Person
            {
                Birthday = DateTimeOffset.Now,
                Country = "country",
                FirstName = "first name 1",
                FirstRussianName = "russian 1",
                LastName = "last name 1",
                LastRussianName = "russian last 2",
                Position = "position",
                Type = PersonType.First
            };
            var person2 = new Person
            {
                Birthday = DateTimeOffset.Now,
                Country = "country 2",
                FirstName = "first name 2",
                FirstRussianName = "russian 21",
                LastName = "last name 21",
                LastRussianName = "russian last 22",
                Position = "position",
                Type = PersonType.Stuff
            };
            var person3 = new Person
            {
                Birthday = DateTimeOffset.Now,
                Country = "country 23",
                FirstName = "first name 23",
                FirstRussianName = "russian 213",
                LastName = "last name 213",
                LastRussianName = "russian last 223",
                Position = "position",
                Type = PersonType.Academy
            };
            _context.Persons.AddRange(person, person2, person3);
            await _context.SaveChangesAsync();
        }

        private static string GetEnumDescription(Enum value)
        {
            FieldInfo fi = value.GetType().GetField(value.ToString());

            DescriptionAttribute[] attributes =
                (DescriptionAttribute[])fi.GetCustomAttributes(
                typeof(DescriptionAttribute),
                false);

            if (attributes != null &&
                attributes.Length > 0)
            {
                return attributes[0].Description;
            }
            else
            {
                return value.ToString();
            }
        }

        private UserManager<User> GetUserManager()
        {
            IPasswordHasher<User> hasher = new PasswordHasher<User>();
            IOptions<IdentityOptions> options = Options.Create(new IdentityOptions());
            ILookupNormalizer normalizer = new UpperInvariantLookupNormalizer();
            options.Value.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@!#$&?";
            options.Value.Lockout.AllowedForNewUsers = true;
            
            var userStore = new UserStore<User, Role, LiverpoolContext, int>(_context);
            return new UserManager<User>(userStore, options, hasher, null, null, normalizer, null, null, new Logger<UserManager<User>>(new LoggerFactory()));
        }
    }
}
