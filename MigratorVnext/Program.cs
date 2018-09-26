using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess;
using MyLiverpool.Data.ResourceAccess.Interfaces;
using MyLiverpool.Data.ResourceAccess.Repositories;

namespace MigratorVnext
{
    public class Program
    {
        private static readonly IGenericRepository<ForumMessage> ForumMessageRepository;
        private static readonly IGenericRepository<ForumSection> ForumSectionRepository;
        private static readonly IForumSubsectionRepository ForumSubsectionRepository;
        private static readonly IForumThemeRepository ForumThemeRepository;
        private static readonly IMaterialRepository MaterialRepository;
        private static readonly IGenericRepository<MaterialCategory> MaterialCategoryRepository;
        private static readonly IMaterialCommentRepository MaterialCommentRepository;
        private static readonly IUserRepository UserRepository;
        private const string Path = @"D:\\downloads\11\_s1\";
        private const string DefaultPhotoPath = "/content/images/default.jpg";
        private static readonly int MaxChars = 20000;
        private const bool UseLimit = false;

        private static readonly List<ForumSubsection> Subsections = new List<ForumSubsection>();
        private static readonly List<ForumTheme> Themes = new List<ForumTheme>();

        private static User _deleted;
        private static LiverpoolContext _db;
        static Program()
        {
          //  Database.SetInitializer(new DatabaseInitializer());
             _db = GetNewContext();
            _db.Database.Migrate();
            new DatabaseInitializer(GetNewContext()).Seed(true);

            var store = new UserStore<User, Role, LiverpoolContext, int>(_db);
           
            IPasswordHasher<User> hasher = new PasswordHasher<User>();
            //var provider = new MachineKeyProtectionProvider();
            //var userStore = new UserStore<User, Role, int, UserLogin, UserRole, UserClaim>(_context);
            IOptions<IdentityOptions> options = Options.Create(new IdentityOptions());
            ILookupNormalizer normalizer = new UpperInvariantLookupNormalizer();
            options.Value.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@!#$&?";
            options.Value.Lockout.AllowedForNewUsers = true;
            var userManager = new UserManager<User>(store, options, hasher, null, null, normalizer, null, null, null);

            UserRepository = new UserRepository(_db, userManager);
            ForumMessageRepository = new GenericRepository<ForumMessage>(GetNewContext());
            ForumSectionRepository = new GenericRepository<ForumSection>(GetNewContext());
            ForumSubsectionRepository = new ForumSubsectionRepository(GetNewContext());
            ForumThemeRepository = new ForumThemeRepository(GetNewContext());
            MaterialRepository = new MaterialRepository(GetNewContext());
            MaterialCategoryRepository = new GenericRepository<MaterialCategory>(GetNewContext());
            MaterialCommentRepository = new MaterialCommentRepository(GetNewContext());

        }

        static void Main()
        {
            UpdateFromFiles();
            UpdateDb();
            Console.ReadKey();
        }

        public static void UpdateFromFiles()
        {
            //UpdateUsers();
            _deleted = UserRepository.FindByNameAsync("deleted").Result;
          //  UpdateUsersId();
            //UpdateBlogCategory();
            //UpdateNewsCategory();
           // UpdateBlogItems();
           // UpdateNewsItems();
           // UpdateComments();
           // UpdateForumSectionsAndPopulateSubsectionList();
           // UpdateForumSubsectionsFromList();
           // UpdateForumThemes();
          //  UpdateForumComments();



            // UpdateUsers(); //1
            //UpdateNewsCategory(); //1
            // UpdateBlogCategory(); //1


            // //Task.WhenAll(blogsC, newsC).Wait();
            // MaterialCategoryRepository.SaveChangesAsync().Wait();

            //// Task.WhenAll(users, forumS).Wait();
            // Console.WriteLine("End 1");

         //   _deleted = UserRepository.FindByNameAsync("deleteUser").Result; // added creating delete uzver

           //    UpdateUsersId(); //2
            //UpdateForumSectionsAndPopulateSubsectionList(); //1 call -> //  UpdateForumSubsectionsFromList(); //2


            //   Task.WhenAll(usersU, forumSubs).Wait();
            Console.WriteLine("End 2");

          //  UpdateBlogItems(); //3
          //  UpdateNewsItems(); //3
         //   UpdateForumThemes(); //3

          //  Task.WhenAll(blogs, forumT).Wait();
          //  Task.WhenAll(news).Wait();
          //  MaterialRepository.SaveChangesAsync().Wait();
            Console.WriteLine("End 3");

           //    UpdateComments(); //4
             //   UpdateForumComments(); //4

            //  Task.WhenAll(matComm, forumMes).Wait();
            Console.WriteLine("End 4");

            // UpdateCommentsLinks();
            UpdateMaterialLinks();
            Console.WriteLine("End 5");
           // DownloadAllImages();
        }

        public static void UpdateDb()
        {
            //UpdateBlogCategoryAndBlogItem();
            //UpdateNewsCategoryAndNewsItem();
            // UpdateCommentsForum();
            //   UpdateForumSectionAndSubsection();
            // UpdateForumSubSectionAndTheme();
            //UpdateComments();
            // UpdateCommentsLinks();
            // UpdateCommentsLinksToNewsAndBlogs();
        }

        private static async void DownloadAllImages()
        {
            var prefix = "http://myliverpool.ru";
     //       var prefix2 = "http://www.myliverpool.ru";
            var path = "D:\\images1123\\";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            var count = _db.Materials.Count();
      //      for (int i = 0; i < count; i ++)
            {
                var materials = _db.Materials.ToList();
                //   Parallel.ForEach(materials, new ParallelOptions()
                //{
                //    MaxDegreeOfParallelism = 2
                //}, async material =>
                var ctr = 1;
                foreach (var material in materials)
                {
                    var images = GetImagesPath(material.Message);
                    var counter = 1;
                    foreach (Group image in images)
                    {
                        var filename = image.Value;
                        var pathForFile = path + image.Value;
                        if (filename.Contains("http"))
                        {
                            if (filename.Contains("myliverpool"))
                            {
                                pathForFile = pathForFile.Replace("http://www.myliverpool.ru/", "")
                                    .Replace("http://myliverpool.ru/", "");
                            }
                            else
                            {
                                continue;
                            }
                        }

                        pathForFile = pathForFile.Replace("/", "\\").Replace(" ", "").Replace("\\\\", "\\");
                        if (counter++ % 2 != 0 || filename.Contains("../../"))
                        {
                            continue;
                        }
                        if (!filename.Contains(prefix) || !filename.Contains(prefix))
                        {
                            filename = prefix + filename;
                        }
                        filename = filename.Replace("content/images/", "").Replace(" ", "");
                        if (!Directory.Exists(pathForFile))
                        {
                            Directory.CreateDirectory(System.IO.Path.GetDirectoryName(pathForFile));
                        }
                        //HttpContent content;
                      //  if (!File.Exists(pathForFile))
                        {
                            using (var client = new HttpClient())
                            using (var request = new HttpRequestMessage(HttpMethod.Get, filename))
                            {
                                HttpResponseMessage msg = await client.SendAsync(request);
                                HttpContent content = msg.Content;
                                using (
                                    Stream contentStream = await content.ReadAsStreamAsync(),
                                        stream = new FileStream(pathForFile, FileMode.Create, FileAccess.Write,
                                            FileShare.None,
                                            4145728, true))
                                {
                                        contentStream.CopyTo(stream);
                                }
                            }
                        }
                    }

                    //      });
                    Console.WriteLine(ctr++ * 1.0 / count * 100);
                }
            }
        }

        #region Update from files to DB
        private static void Example()
        {
            Console.WriteLine("Start ");
            using (FileStream fs = new FileStream(Path + Path + ".txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                for (int i = 0; i < chars.Length; i++)
                {
                    User user = new User();
                    // login
                    while (chars[i] != '|')
                    {
                        user.UserName += chars[i];
                        i++;
                    }
                    // gender
                    while (chars[i] != '|')
                    {
                        if (chars[i] == 1)
                            user.Gender = true;
                        i++;
                    }
                    i++;
                    // last modified
                    string lastDate = null;
                    while (chars[i] != '|')
                    {
                        lastDate += chars[i];
                        i++;
                    }
                    user.LastModified = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(lastDate));
                    UserRepository.AddAsync(user).RunSynchronously();
                    while (chars[i] != 10)
                    {
                        i++;
                    }
                }
            }
        }

        private static void UpdateUsers()
        {
            Console.WriteLine("Start UpdateUsers");
            using (FileStream fs = new FileStream(Path + @"users.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars;
                }
                for (int i = 0; i < limit; i++)
                {
                    User user = new User()
                    {
                        //Id = Guid.NewGuid().ToString(),
                    };
                    // login
                    while (chars[i] != '|')
                    {
                        user.UserName += chars[i];
                        i++;
                    }
                    i++;
                    // uid 
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    // pass
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    // photopath
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    // flags ???
                    string flags = null;
                    while (chars[i] != '|')
                    {
                        flags += chars[i];
                        i++;
                    }
                    i++;
                    // fullname
                    while (chars[i] != '|')
                    {
                        user.FullName += chars[i];
                        i++;
                    }
                    i++;
                    // gender
                    while (chars[i] != '|')
                    {
                        if (chars[i] == 1)
                            user.Gender = true;
                        i++;
                    }
                    i++;
                    // email
                    while (chars[i] != '|')
                    {
                        user.Email += chars[i];
                        i++;
                    }
                    i++;
                    // homepage
                    while (chars[i] != '|')
                    {
                        user.Homepage += chars[i];
                        i++;
                    }
                    i++;
                    // icq
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    // counry
                    while (chars[i] != '|')
                    {
                        user.Country += chars[i];
                        i++;
                    }
                    i++;
                    // state
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    // city
                    while (chars[i] != '|')
                    {
                        user.City += chars[i];
                        i++;
                    }
                    i++;
                    // signature
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    // title
                    while (chars[i] != '|')
                    {
                        user.Title += chars[i];
                        i++;
                    }
                    i++;
                    // regdate
                    string regdate = null;
                    while (chars[i] != '|')
                    {
                        regdate += chars[i];
                        i++;
                    }
                    user.RegistrationDate = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(regdate));
                    i++;
                    // ip
                    while (chars[i] != '|')
                    {
                        user.Ip += chars[i];
                        i++;
                    }
                    i++;
                    // o ld-field
                    string hz = null;
                    while (chars[i] != '|')
                    {
                        hz += chars[i];
                        i++;
                    }
                    i++;
                    // aol
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    // msn
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    // yahoo
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    // ispm
                    string ispm = null;
                    while (chars[i] != '|')
                    {
                        ispm += chars[i];
                        i++;
                    }
                    i++;
                    // birthday
                    string birthday = null;
                    while (chars[i] != '|')
                    {
                        birthday += chars[i];
                        i++;
                    }
                    if (birthday != null)
                    {
                        user.Birthday = DateTime.Parse(birthday);
                    }
                    i++;
                    // verify
                    string fv = null;
                    while (chars[i] != '|')
                    {

                        fv += chars[i];
                        if (chars[i] == '0')
                        {
                            user.EmailConfirmed = true;
                        }
                        i++;
                    }
                    i++;
                    // options
                    string fe = null;
                    while (chars[i] != '|')
                    {
                        fe += chars[i];
                        i++;
                    }
                    i++;
                    // last modified
                    string lastDate = null;

                    while (chars[i] != '|')
                    {
                        if (char.IsDigit(chars[i]) && chars[i + 1] == '\\')
                        {
                            i += 3;
                        }

                        lastDate += chars[i];
                        i++;
                    }
                    user.LastModified = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(lastDate));
                    user.RoleGroupId = _db.RoleGroups.First(x => x.Name == RoleGroupsEnum.Simple.ToString()).Id;
                    user.Photo = "/content/avatars/default.png";
                    var result = UserRepository.AddAsync(user).Result;
                    //r.Wait();
                    while (chars[i] != 10)
                    {
                        i++;
                    }
                    Console.Write("| " + (i * 1.00 / chars.Length).ToString("P"));
                }
            }

            //var deleteUser = new User()
            //{
            //    UserName = "deleteUser",
            //    RoleGroupId = (int)RoleGroupsEnum.Simple,
            //    Photo = "/content/avatars/default.png",
            //};
            //_deleted = UserRepository.AddAsync(deleteUser).Result;
          //  UserRepository.SaveChangesAsync().Wait();
            Console.WriteLine("End UpdateUsers");
        }

        private static void UpdateUsersId()
        {
            Console.WriteLine("Start UpdateUsersId");
            using (FileStream fs = new FileStream(Path + "ugen.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars;
                }
                for (int i = 0; i < limit; i++)
                {

                    // id
                    string id = null;
                    while (chars[i] != '|')
                    {
                        id += chars[i];
                        i++;
                    }
                    i++;
                    // login
                    string userLogin = null;
                    while (chars[i] != '|')
                    {
                        userLogin += chars[i];
                        i++;
                    }
                    i++;
                    User user = UserRepository.FindByNameAsync(userLogin).Result;
                    if (user != null)
                    {
                        user.OldId = int.Parse(id);
                        UserRepository.UpdateAsync(user).Wait();
                    }

                    while (chars[i] != 10)
                    {
                        i++;
                    }
                    Console.Write("| " + (i * 1.00 / chars.Length).ToString("P"));
                }
            }
            Console.WriteLine("End UpdateUsersId");
        }

        private static void UpdateBlogItems()
        {
            Console.WriteLine("Start UpdateBlogItems");
            using (FileStream fs = new FileStream(Path + "blog.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars;
                }

                var categories = MaterialCategoryRepository.GetListAsync().Result.Where(x => x.MaterialType == MaterialType.Blogs).ToList();

                for (int i = 0; i < limit; i++)
                {
                    Material blogItem = new Material()
                    {
                        Type = MaterialType.Blogs
                    };
                    // id
                    string id = null;
                    while (chars[i] != '|')
                    {
                        id += chars[i];
                        i++;
                    }
                    blogItem.OldId = int.Parse(id);
                    i++;
                    // Category id
                    string categoryId = null;
                    while (chars[i] != '|')
                    {
                        categoryId += chars[i];
                        i++;
                    }
                    // blogItem.CategoryId = int.Parse(categoryId);

                    i++;
                    // year
                    string year = null;
                    while (chars[i] != '|')
                    {
                        year += chars[i];
                        i++;
                    }
                    //blogItem.Year = int.Parse(year);
                    i++;
                    // month
                    string month = null;
                    while (chars[i] != '|')
                    {
                        month += chars[i];
                        i++;
                    }
                    // blogItem.Month = int.Parse(month);
                    i++;
                    // day
                    string day = null;
                    while (chars[i] != '|')
                    {
                        day += chars[i];
                        i++;
                    }
                    // blogItem.Day = int.Parse(day);
                    i++;
                    // pending
                    while (chars[i] != '|')
                    {
                        if (chars[i] == '1')
                            blogItem.Pending = true;
                        i++;
                    }
                    i++;
                    // onTop
                    while (chars[i] != '|')
                    {
                        if (chars[i] == '1')
                            blogItem.OnTop = true;
                        i++;
                    }
                    i++;
                    //commentary_may
                    while (chars[i] != '|')
                    {
                        if (chars[i] == '1')
                            blogItem.CanCommentary = true;
                        i++;
                    }
                    i++;
                    //add time
                    string addTime = null;
                    while (chars[i] != '|')
                    {
                        addTime += chars[i];
                        i++;
                    }
                    i++;
                    blogItem.AdditionTime = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(addTime));
                    // commentary Number
                    string numberCommentary = null;
                    while (chars[i] != '|')
                    {
                        numberCommentary += chars[i];
                        i++;
                    }
                    i++;
                    //   blogItem.NumberCommentaries = int.Parse(numberCommentary);

                    //author
                    string userName = null;
                    while (chars[i] != '|')
                    {
                        userName += chars[i];
                        i++;
                    }
                    i++;

                    var author = UserRepository.FindByNameAsync(userName).Result;
                    blogItem.AuthorId = author?.Id ?? _deleted.Id;
                    //title
                    string title = null;
                    while (chars[i] != '|')
                    {
                        title += chars[i];
                        i++;
                    }
                    i++;

                    blogItem.Title = title;
                    //brief
                    string brief = null;
                    while (chars[i] != '|')
                    {
                        brief += chars[i];
                        i++;
                    }
                    i++;

                    if (brief != null)
                    {
                        brief = Regex.Replace(brief, "<!--IMG1-->", "");
                        var matches = Regex.Matches(brief, "src\\s*=\\s*['\"](?<src>[^'\"]*)['\"]", RegexOptions.IgnoreCase);
                        if (matches.Count > 0)
                        {
                            var path1 = Regex.Replace(matches[0].Value, "src=", "");
                            var path2 = Regex.Replace(path1, "\"", "");
                            blogItem.PhotoPath = path2;
                        }
                        brief = Regex.Replace(brief, "<img([\\w\\W]+?)/>", "");
                    }
                    blogItem.Brief = brief;
                    // message
                    string message = null;
                    while (chars[i] != '|')
                    {
                        message += chars[i];
                        i++;
                    }
                    i++;

                    blogItem.Message = message;
                    // attach
                    while (chars[i] != '|')
                    {
                        id += chars[i];
                        i++;
                    }
                    i++;

                    // files
                    while (true)
                    {
                        if (chars[i] == '\\' && chars[i + 1] == '|' && chars[i + 2] == '|')
                        {
                            break;
                        }
                        i++;
                    }
                    i += 3;
                    //i++;

                    // reads
                    string reads = null;


                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;

                    blogItem.Reads = int.Parse(reads);
                    // rating
                    string rating = null;
                    while (chars[i] != '|')
                    {
                        rating += chars[i];
                        i++;
                    }
                    i++;

                    blogItem.Rating = float.Parse(rating);
                    // rate_num
                    string ratingNumbers = null;
                    while (chars[i] != '|')
                    {
                        ratingNumbers += chars[i];
                        i++;
                    }
                    i++;

                    blogItem.RatingNumbers = int.Parse(ratingNumbers);
                    // rate sum
                    string ratingSumm = null;
                    while (chars[i] != '|')
                    {
                        ratingSumm += chars[i];
                        i++;
                    }
                    i++;

                    blogItem.RatingSumm = int.Parse(ratingSumm);
                    //rate ip
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;

                    // other 1
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;

                    // other 2 SOURCE
                    string source = null;
                    while (chars[i] != '|')
                    {
                        source += chars[i];
                        i++;
                    }
                    blogItem.Source = source;
                    i++;

                    // other 3
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;

                    // other 4
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;

                    // other 5
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;
                    // other6
                    while (chars[i] != '|')
                    {
                        // reads += chars[i];
                        i++;
                    }
                    i++;

                    // uid
                    while (chars[i] != '|')
                    {
                        // reads += chars[i];
                        i++;
                    }
                    i++;

                    // subscr
                    while (chars[i] != '|')
                    {
                        // reads += chars[i];
                        i++;
                    }
                    i++;

                    // last modified
                    string lastDate = null;
                    while (char.IsDigit(chars[i]))// != '|' || chars[i] != '\\'))
                    {
                        lastDate += chars[i];
                        i++;
                    }
                    //i++;

                    blogItem.LastModified = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(lastDate));

                    //if (useLimit && blogItem.Author == null)
                    //{
                    //}
                    //else
                    //{
                    var category = categories.FirstOrDefault(x => x.OldId == int.Parse(categoryId)) ?? categories.FirstOrDefault(x => x.OldId == 1 && x.MaterialType == MaterialType.Blogs);

                    blogItem.CategoryId = category.Id;
                    if (blogItem.PhotoPath == null)
                    {
                        blogItem.PhotoPath = GetFirstImagePath(blogItem.Message);
                    }
                    //   category.BlogItems.Add(blogItem);
                    var result = MaterialRepository.AddAsync(blogItem).Result;
                    //  }
                    // while (chars[i] != 10)
                    //  {
                    //       i++;
                    //  }
                    Console.Write("| " + (i * 1.00 / chars.Length).ToString("P"));
                }
             //   MaterialRepository.SaveChangesAsync().Wait();
            }
            Console.WriteLine("End UpdateBlogItems");
        }

        private static void UpdateNewsItems()
        {
            Console.WriteLine("Start UpdateNewsItems");
            using (FileStream fs = new FileStream(Path + "news.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars * 10;
                }
                
                var categories = MaterialCategoryRepository.GetListAsync().Result.Where(x => x.MaterialType == MaterialType.News).ToList();

                for (int i = 0; i < limit; i++)
                {
                    Material newsItem = new Material()
                    {
                        Type = MaterialType.News
                    };
                    // id
                    
                    string id = null;
                    while (chars[i] != '|')
                    {
                        id += chars[i];
                        i++;
                    }
                    newsItem.OldId = int.Parse(id);
                    if (newsItem.OldId == 14534)
                    {
                        
                    }
                    i++;
                    // Category id
                    string categoryId = "";
                    while (chars[i] != '|')
                    {
                        categoryId += chars[i];
                        i++;
                    }
                    //  newsItem.CategoryId = int.Parse(categoryId);


                    i++;
                    // year
                    string year = null;
                    while (chars[i] != '|')
                    {
                        year += chars[i];
                        i++;
                    }
                    // newsItem.Year = int.Parse(year);
                    i++;
                    // month
                    string month = null;
                    while (chars[i] != '|')
                    {
                        month += chars[i];
                        i++;
                    }
                    // newsItem.Month = int.Parse(month);
                    i++;
                    // day
                    string day = null;
                    while (chars[i] != '|')
                    {
                        day += chars[i];
                        i++;
                    }
                    //newsItem.Day = int.Parse(day);
                    i++;
                    // pending
                    while (chars[i] != '|')
                    {
                        if (chars[i] == '1')
                            newsItem.Pending = true;
                        i++;
                    }
                    i++;
                    // onTop
                    while (chars[i] != '|')
                    {
                        if (chars[i] == '1')
                            newsItem.OnTop = true;
                        i++;
                    }
                    i++;
                    //commentary_may
                    while (chars[i] != '|')
                    {
                        if (chars[i] == '1')
                            newsItem.CanCommentary = true;
                        i++;
                    }
                    i++;
                    //add time
                    string addTime = null;
                    while (chars[i] != '|')
                    {
                        addTime += chars[i];
                        i++;
                    }
                    i++;
                    newsItem.AdditionTime = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(addTime));
                    // commentary Number
                    string numberCommentary = null;
                    while (chars[i] != '|')
                    {
                        numberCommentary += chars[i];
                        i++;
                    }
                    i++;
                    //      newsItem.NumberCommentaries = int.Parse(numberCommentary);
                    //author
                    string userName = null;
                    while (chars[i] != '|')
                    {
                        userName += chars[i];
                        i++;
                    }
                    i++;

                    var author = UserRepository.FindByNameAsync(userName).Result;

                    newsItem.AuthorId = author?.Id ?? _deleted.Id;
                    //title
                    string title = null;
                    while (chars[i] != '|')
                    {
                        title += chars[i];
                        i++;
                    }
                    i++;

                    newsItem.Title = title;
                    //brief
                    string brief = null;
                    while (chars[i] != '|')
                    {
                        brief += chars[i];
                        i++;
                    }
                    i++;
                    if (brief != null)
                    {
                        brief = Regex.Replace(brief, "<!--IMG1-->", "");
                        var matches = Regex.Matches(brief, "src\\s*=\\s*['\"](?<src>[^'\"]*)['\"]", RegexOptions.IgnoreCase);
                        if (matches.Count > 0)
                        {
                            var path1 = Regex.Replace(matches[0].Value, "src=", "");
                            var path2 = Regex.Replace(path1, "\"", "");
                            newsItem.PhotoPath = path2;
                        }
                        brief = Regex.Replace(brief, "<img([\\w\\W]+?)/>", "");
                    }
                    newsItem.Brief = brief;
                    // message
                    string message = null;
                    while (chars[i] != '|')
                    {
                        message += chars[i];
                        i++;
                    }
                    i++;

                    message = Regex.Replace(message, "<!--IMG2-->", "");
                    newsItem.Message = message;

                    //while (true)
                    //{
                    //    if ( chars[i] == '|' && char.IsDigit(chars[i + 1]))
                    //    {
                    //        break;
                    //    }
                    //    i++;
                    //}
                    //i += 3;
                    // attach
                    while (chars[i] != '|')
                    {
                        //id += chars[i];
                        i++;
                    }
                    i++;

                    // files
                    bool notExit = false;

                    while (chars[i] != '|' || notExit)
                    {
                        notExit = false;
                        i++;
                        //look forward
                   //     var temp = SubAchars.(i).Take(20).Select(x => x).ToString();
                        var temp = new string(SubArray(chars, i, 20));
                        if (temp.Contains("jpg") || temp.Contains("png") || temp.Contains("gif") || temp.Contains("jpeg") || temp.Contains("jpe"))
                        {
                            notExit = true;
                        }
                    }
                    i++;

                    if (chars[i] == '|')
                        i++;
                    // reads
                    string reads = null;
                    
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;

                    }

                    i++;
                    
                    newsItem.Reads = int.Parse(reads);
                    // rating
                    string rating = null;
                    while (chars[i] != '|')
                    {
                        rating += chars[i];
                        i++;
                    }
                    i++;

                    newsItem.Rating = float.Parse(rating);
                    // rate_num
                    string ratingNumbers = null;
                    while (chars[i] != '|')
                    {
                        ratingNumbers += chars[i];
                        i++;
                    }
                    i++;

                    newsItem.RatingNumbers = int.Parse(ratingNumbers);
                    // rate sum
                    string ratingSumm = null;
                    while (chars[i] != '|')
                    {
                        ratingSumm += chars[i];
                        i++;
                    }
                    i++;

                    newsItem.RatingSumm = int.Parse(ratingSumm);
                    //rate ip
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;

                    // other 1
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;

                    // other 2 SOURCE
                    string source = null;
                    while (chars[i] != '|')
                    {
                        source += chars[i];
                        i++;
                    }
                    newsItem.Source = source;
                    i++;

                    // other 3
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;

                    // other 4
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;

                    // other 5
                    while (chars[i] != '|')
                    {
                        reads += chars[i];
                        i++;
                    }
                    i++;
                    // other6
                    while (chars[i] != '|')
                    {
                        // reads += chars[i];
                        i++;
                    }
                    i++;

                    // uid
                    while (chars[i] != '|')
                    {
                        // reads += chars[i];
                        i++;
                    }
                    i++;

                    // subscr
                    while (chars[i] != '|')
                    {
                        // reads += chars[i];
                        i++;
                    }
                    i++;

                    // last modified
                    string lastDate = null;
                    while (char.IsDigit(chars[i]))// != '|' || chars[i] != '\\'))
                    {
                        lastDate += chars[i];
                        i++;
                    }
                    //i++;

                    newsItem.LastModified = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(lastDate));

                    //if (useLimit && newsItem.Author == null)
                    //{
                    //}
                    //else
                    //{
                    var category = categories.FirstOrDefault(x => x.OldId == int.Parse(categoryId)) ?? categories.First(x => x.OldId == 5 && x.MaterialType == MaterialType.News); //old new doesn't contain category
                    newsItem.CategoryId = category.Id;
                    if (newsItem.PhotoPath == null)
                    {
                        newsItem.PhotoPath = GetFirstImagePath(newsItem.Message);
                    }
                    //  category.Materials.Add(newsItem);
                    var result = MaterialRepository.AddAsync(newsItem).Result;
                    // }
                    // while (chars[i] != 10)
                    //  {
                    //       i++;
                    //  }
                    Console.Write("| " + newsItem.OldId + " " + (i * 1.00 / chars.Length).ToString("P"));
                }
            //    MaterialRepository.SaveChangesAsync().Wait();
            }
            Console.WriteLine("End UpdateNewsItems");
        }

        private static void UpdateBlogCategory()
        {
            Console.WriteLine("Start UpdateBlogCategory");
            using (FileStream fs = new FileStream(Path + "bl_bl.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars;
                }
                for (int i = 0; i < limit; i++)
                {
                    MaterialCategory blogCategory = new MaterialCategory()
                    {
                        MaterialType = MaterialType.Blogs
                    };
                    // id
                    string id = null;
                    while (chars[i] != '|')
                    {
                        id += chars[i];
                        i++;
                    }
                    i++;
                    blogCategory.OldId = int.Parse(id);
                    // position
                    string position = null;
                    while (chars[i] != '|')
                    {
                        position += chars[i];
                        i++;
                    }
                    i++;
                    //  blogCategory.Position = int.Parse(position);
                    // count
                    string count = null;
                    while (chars[i] != '|')
                    {
                        count += chars[i];
                        i++;
                    }
                    i++;
                    //   blogCategory.ItemsCount = int.Parse(count);

                    // name
                    while (chars[i] != '|')
                    {
                        blogCategory.Name += chars[i];
                        i++;
                    }
                    i++;
                    // description
                    i++;
                    // url
                    var urlPath = "";
                    if (chars[i] != '|')
                    {
                        while (chars[i] != '|')
                        {
                            urlPath += chars[i];
                            i++;
                        }
                    }
                    i++;
                    
                    Console.Write("| " + (i * 1.00 / chars.Length).ToString("P"));
                    var result = MaterialCategoryRepository.CreateAsync(blogCategory).Result;
                }
             //    MaterialCategoryRepository.SaveChangesAsync().Wait();
            }
            Console.WriteLine("End UpdateBlogCategory");
        }

        private static void UpdateNewsCategory()
        {
            Console.WriteLine("Start UpdateNewsCategory");
            using (FileStream fs = new FileStream(Path + "nw_nw.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars;
                }
                for (int i = 0; i < limit; i++)
                {
                    MaterialCategory newsCategory = new MaterialCategory()
                    {
                        MaterialType = MaterialType.News
                    };
                    // id
                    string id = string.Empty;
                    while (chars[i] != '|')
                    {
                        id += chars[i];
                        i++;
                    }
                    i++;
                    newsCategory.OldId = int.Parse(id);
                    // position
                    string position = string.Empty;
                    while (chars[i] != '|')
                    {
                        position += chars[i];
                        i++;
                    }
                    i++;
                    //   newsCategory.Position = int.Parse(position);
                    // count
                    string count = string.Empty;
                    while (chars[i] != '|')
                    {
                        count += chars[i];
                        i++;
                    }
                    i++;
                    // newsCategory.ItemsCount = int.Parse(count);

                    // name
                    while (chars[i] != '|')
                    {
                        newsCategory.Name += chars[i];
                        i++;
                    }
                    i++;

                    // url
                    var urlPath = "";
                    if (chars[i] == '|')
                    {
                        i++;
                        while (chars[i] != '|')
                        {
                            urlPath += chars[i];
                            i++;
                        }
                        i++;
                    }
                    var result = MaterialCategoryRepository.CreateAsync(newsCategory).Result;
                    Console.Write("| " + (i * 1.00 / chars.Length).ToString("P"));
                }
              //    MaterialCategoryRepository.SaveChangesAsync().Wait();
            }
            Console.WriteLine("End UpdateNewsCategory");
        }

        private static void UpdateComments()
        {
            Console.WriteLine("Start UpdateComments");
            using (FileStream fs = new FileStream(Path + "comments.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars * 10;
                }

                var news = MaterialRepository.GetAsync().Result;//n => n.NumberCommentaries > 0);
                                                                           //   var blogs = UnitOfWork.BlogItemRepository.GetAsync().Result;//n => n.NumberCommentaries > 0);

                for (int i = 0; i < limit; i++)
                {
                    // id
                    string id = null;
                    while (chars[i] != '|')
                    {
                        id += chars[i];
                        i++;
                    }
                    i++;

                    // module id
                    string moduleId = null;
                    while (chars[i] != '|')
                    {
                        moduleId += chars[i];
                        i++;
                    }
                    i++;
                    var ModuleId = int.Parse(moduleId);


                    //material id
                    string materialId = null;
                    while (chars[i] != '|')
                    {
                        materialId += chars[i];
                        i++;
                    }
                    i++;

                    // pending
                    char pending = '0';
                    while (chars[i] != '|')
                    {
                        pending = chars[i];
                        i++;
                    }
                    i++;
                    // add time
                    string additionTime = null;
                    while (chars[i] != '|')
                    {
                        additionTime += chars[i];
                        i++;
                    }
                    i++;

                    //author
                    string userName = null;
                    while (chars[i] != '|')
                    {
                        userName += chars[i];
                        i++;
                    }
                    i++;

                    //name
                    string name = null;
                    while (chars[i] != '|')
                    {
                        name += chars[i];
                        i++;
                    }
                    if (userName == null)
                    {
                        userName = name;
                    }
                    i++;
                    //email
                    string email = null;
                    while (chars[i] != '|')
                    {
                        email += chars[i];
                        i++;
                    }
                    i++;
                    //www
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    //ip
                    string ip = null;
                    while (chars[i] != '|')
                    {
                        ip += chars[i];
                        i++;
                    }
                    i++;
                    // message
                    string message = null;
                    while (chars[i] != '|')
                    {
                        message += chars[i];
                        i++;
                    }
                    i++;

                    // answer
                    string answer = null;
                    while (chars[i] != '|')
                    {
                        answer += chars[i];
                        i++;
                    }
                    i++;


                    // user id
                    string userId = null;
                    while (chars[i] != '|')
                    {
                        userId += chars[i];
                        i++;
                    }
                    i++;
                    // parent id
                    string parentId = null;
                    while (chars[i] != '|')
                    {
                        parentId += chars[i];
                        i++;
                    }
                    i++;


                    while (chars[i] != 10)
                    {
                        i++;
                    }
                  //  if (int.Parse(id) < 256161)
                    {
                   //     continue;
                    }
                    // user id
                    //string rate = null;
                    //while (chars[i] != '|')
                    //{
                    //    rate += chars[i];
                    //    i++;
                    //}
                    //i++;
                    //// rate
                    //string rateId = null;
                    //while (chars[i] != '|')
                    //{
                    //    rateId += chars[i];
                    //    i++;
                    //}
                    //i++;




                    //foreach (var comment in newsComments)
                    //{
                    //    foreach (var item in news.Where(newsItem => comment.MaterialId == newsItem.Id))
                    //    {
                    //        if (item.Children == null)
                    //        {
                    //            item.Children = new List<NewsComment>();
                    //        }
                    //        item.Children.Add(comment);
                    //        comment.MaterialId = item.Id;
                    //    }
                    //}
                    if (ModuleId != 1 && ModuleId != 2)
                    {
                        continue;
                        //moduleID (1=>'blog',2=>'news',3=>'publ',4=>'photo',5=>'load',6=>'dir',7=>'board')
                    }
                    var materialType = CommentType.News;
                    if (ModuleId == 2)
                    {
                        materialType = CommentType.News;
                    }
                    else if (ModuleId == 1)
                    {
                        materialType = CommentType.Blogs;
                    }
                    User author = null;
                    if (!string.IsNullOrEmpty(userName))
                    {
                        author = UserRepository.FindByNameAsync(userName).Result;
                    }
                    var material = news.FirstOrDefault(newsItem => newsItem.OldId == int.Parse(materialId));
                    if (material == null)
                    {
                        continue;
                    }

                    MaterialComment comment = new MaterialComment()
                    {
                        Type = materialType,
                   //     MaterialId = int.Parse(materialId),
                        OldId = int.Parse(id),
                        IsVerified = true,
                        AdditionTime = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(additionTime)),
                        AuthorId = author?.Id ?? _deleted.Id,
                        Answer = answer,
                        Message = message,
                        MaterialId = material.Id,
                        LastModified = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(additionTime)),
                        Pending = false

                    };
                    
                 //  if (comment.Material.Comments == null)
                 //   {
                  //      comment.Material.Comments = new List<MaterialComment>();
                  //  }
                  //  comment.Material.Comments.Add(comment);
                    if (pending == '1')
                        comment.Pending = true;

                    var parId = int.Parse(parentId);
                    comment.OldParentId = parId;
                    //if (parId > 0)
                    //{
                    //    var parent =
                    //        MaterialCommentRepository.GetOrderedByAsync(1, filter: x => x.OldId == parId).Result.FirstOrDefault();
                    //    comment.Parent = parent ?? null;
                    //}
                    //comment.ParentId = int.Parse(parentId);

                    var result = MaterialCommentRepository.AddAsync(comment);
                    Console.Write("| " + (i * 1.00 / chars.Length).ToString("P"));
                }
            //    MaterialCommentRepository.SaveChangesAsync().Wait();
            }
            Console.WriteLine("End UpdateComments");
        }

        private static void UpdateForumSectionsAndPopulateSubsectionList()
        {
            Console.WriteLine("Start UpdateForumSections");
            using (FileStream fs = new FileStream(Path + "fr_fr.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                var forumSubsections = new List<ForumSubsection>();
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars;
                }
                for (int i = 0; i < limit; i++)
                {
                    if (chars[i + 2] == '0' || chars[i + 3] == '0')
                    {
                        ForumSection forumSection = new ForumSection();
                        string id = null;
                        while (chars[i] != '|')
                        {
                            id += chars[i];
                            i++;
                        }
                        i++;
                        forumSection.IdOld = int.Parse(id);
                        // section id
                        while (chars[i] != '|')
                        {
                            i++;
                        }
                        i++;
                        // is section
                        while (chars[i] != '|')
                        {
                            i++;
                        }
                        i++;
                        // sequence
                        while (chars[i] != '|')
                        {
                            i++;
                        }
                        i++;
                        // time creation
                        while (chars[i] != '|')
                        {
                            i++;
                        }
                        i++;
                        // name
                        while (chars[i] != '|')
                        {
                            forumSection.Name += chars[i];
                            i++;
                        }
                        ForumSectionRepository.CreateAsync(forumSection);
                        while (chars[i] != 10)
                        {
                            i++;
                        }
                    }
                    else
                    {
                        ForumSubsection forumSubsection = new ForumSubsection();
                        // id
                        string id = null;
                        while (chars[i] != '|')
                        {
                            id += chars[i];
                            i++;
                        }
                        i++;
                        forumSubsection.IdOld = int.Parse(id);
                        // section id
                        string sectionId = null;
                        while (chars[i] != '|')
                        {
                            sectionId += chars[i];
                            i++;
                        }
                        i++;

                        forumSubsection.SectionId = int.Parse(sectionId);
                        // is section
                        while (chars[i] != '|')
                        {
                            i++;
                        }
                        i++;
                        // sequence
                        while (chars[i] != '|')
                        {
                            i++;
                        }
                        i++;
                        // sequence
                        while (chars[i] != '|')
                        {
                            i++;
                        }
                        i++;
                        // name 
                        while (chars[i] != '|')
                        {
                            forumSubsection.Name += chars[i];
                            i++;
                        }
                        i++;
                        // description 
                        while (chars[i] != '|')
                        {
                            forumSubsection.Description += chars[i];
                            i++;
                        }
                        i++;
                        // last modified

                        Subsections.Add(forumSubsection);
                        while (chars[i] != 10)
                        {
                            i++;
                        }
                    }

                    Console.Write("| " + (i * 1.00 / chars.Length).ToString("P"));
                }
            }
           // ForumSectionRepository.SaveChangesAsync().Wait();
            Console.WriteLine("End UpdateForumSections");
            UpdateForumSubsectionsFromList();
        }

        private static void UpdateForumSubsectionsFromList()
        {
            Console.WriteLine("Start UpdateForumSubsections");
            var sections = ForumSectionRepository.GetListAsync().Result;

            foreach (var subsection in Subsections)
            {
                var sectionId = sections.First(x => x.IdOld == subsection.SectionId).Id;
                subsection.SectionId = sectionId;
            }

            Subsections.ForEach(x => ForumSubsectionRepository.AddAsync(x));

         //   ForumSubsectionRepository.SaveChangesAsync().Wait();
            Console.WriteLine("End UpdateForumSubsections");
        }

        private static void UpdateForumThemes()
        {
            Console.WriteLine("Start UpdateForumThemes");
            using (FileStream fs = new FileStream(Path + "forum.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars;
                }
                for (int i = 0; i < limit; i++)
                {
                    ForumTheme forumTheme = new ForumTheme();
                    // id
                    string id = null;
                    while (chars[i] != '|')
                    {
                        id += chars[i];
                        i++;
                    }
                    i++;
                    forumTheme.IdOld = int.Parse(id);
                    // section id
                    string sectionId = null;
                    while (chars[i] != '|')
                    {
                        sectionId += chars[i];
                        i++;
                    }
                    i++;
                    if (forumTheme.IdOld == 2126)
                    {
                        //should skip
                    }
                    var subsection =
                        ForumSubsectionRepository.GetListAsync().Result.First(x => x.IdOld == int.Parse(sectionId));
                    forumTheme.SubsectionId = subsection.Id;
                    // isPoll
                    while (chars[i] != '|')
                    {
                        if (chars[i] == '1')
                            forumTheme.IsPool = true;
                        i++;
                    }
                    i++;
                    // on top
                    while (chars[i] != '|')
                    {
                        if (chars[i] == '1')
                            forumTheme.OnTop = true;
                        i++;
                    }
                    i++;
                    // last modified
                    string lastDateMessage = null;
                    while (chars[i] != '|')
                    {
                        lastDateMessage += chars[i];
                        i++;
                    }
                    i++;
                    forumTheme.LastMessageAdditionTime = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(lastDateMessage));
                    // is CLosed
                    while (chars[i] != '|')
                    {
                        if (chars[i] == '1')
                            forumTheme.IsClosed = true;
                        i++;
                    }
                    i++;
                    // answers
                    string answers = null;
                    while (chars[i] != '|')
                    {
                        answers += chars[i];
                        i++;
                    }
                    i++;
                    forumTheme.Answers = int.Parse(answers);
                    // views
                    string views = null;
                    while (chars[i] != '|')
                    {
                        views += chars[i];
                        i++;
                    }
                    i++;
                    forumTheme.Views = int.Parse(views);
                    // name
                    while (chars[i] != '|')
                    {
                        forumTheme.Name += chars[i];
                        i++;
                    }
                    i++;
                    // Description
                    while (chars[i] != '|')
                    {
                        forumTheme.Description += chars[i];
                        i++;
                    }
                    i++;
                    // author
                    string author = null;
                    while (chars[i] != '|')
                    {
                        author += chars[i];
                        i++;
                    }
                    i++;
                    var user = UserRepository.FindByNameAsync(author).Result;
                    forumTheme.AuthorId = user?.Id ?? _deleted.Id;
                    // user reg????
                    while (chars[i] != '|')
                    {
                        //author += chars[i];
                        i++;
                    }
                    i++;
                    // author last answer
                    string authorLastMessage = null;
                    while (chars[i] != '|')
                    {
                        authorLastMessage += chars[i];
                        i++;
                    }
                    i++;
                    var lastAnswerUser = UserRepository.FindByNameAsync(authorLastMessage).Result;
                    if (authorLastMessage == "Kapral-006")
                    {
                        continue;
                    }
                    forumTheme.LastAnswerUserId = lastAnswerUser?.Id ?? _deleted.Id;


                    Themes.Add(forumTheme);
                    if (_db.ForumThemes.All(x => x.IdOld != forumTheme.IdOld))
                    {
                        var result = ForumThemeRepository.AddAsync(forumTheme).Result;
                    }
                    while (chars[i] != 10)
                    {
                        i++;
                    }
                    Console.Write("| " + forumTheme.IdOld + " " + (i * 1.00 / chars.Length).ToString("P"));
                }
             //   ForumThemeRepository.SaveChangesAsync().Wait();
            }
            Console.WriteLine("End UpdateForumThemes");
        }

        private static void UpdateForumComments()
        {
            Console.WriteLine("Start UpdateForumComments");
            using (FileStream fs = new FileStream(Path + "forump.txt", FileMode.Open))
            {
                byte[] data = new byte[fs.Length];
                fs.Read(data, 0, Convert.ToInt32(fs.Length));

                char[] chars = Encoding.UTF8.GetString(data).ToCharArray();
                var limit = chars.Length;
                if (UseLimit && MaxChars < chars.Length)
                {
                    limit = MaxChars;
                }
                for (int i = 0; i < limit; i++)
                {
                    ForumMessage forumMessage = new ForumMessage();
                    // id
                    string id = null;
                    while (chars[i] != '|')
                    {
                        id += chars[i];
                        i++;
                    }
                    i++;
                    forumMessage.OldId = int.Parse(id);

                    // module id
                    string moduleId = null;
                    while (chars[i] != '|')
                    {
                        moduleId += chars[i];
                        i++;
                    }
                    i++;
                    //  var theme = UnitOfWork.ForumThemeRepository.GetAsync().Result.FirstOrDefault(x => x.IdOld == int.Parse(moduleId));

                    var theme = ForumThemeRepository.GetListAsync().Result.FirstOrDefault(x => x.IdOld == int.Parse(moduleId));
                    if (UseLimit || theme != null)
                    {
                        // theme.Messages = 
                        forumMessage.ThemeId = theme.Id;
                    }

                    //material id
                    string additionTime = null;
                    while (chars[i] != '|')
                    {
                        additionTime += chars[i];
                        i++;
                    }
                    i++;
                    forumMessage.AdditionTime = DateTimeHelpers.ConvertUtcToLocalTime(long.Parse(additionTime));
                    forumMessage.LastModifiedTime = forumMessage.AdditionTime;
                    // pending
                    while (chars[i] != '|')
                    {
                        if (chars[i] == 1)
                            forumMessage.IsFirstMessage = true;
                        i++;
                    }
                    i++;
                    // message
                    while (chars[i] != '|')
                    {
                        forumMessage.Message += chars[i];
                        i++;
                    }
                    i++;
                    //user is reg
                    while (chars[i] != '|')
                    {
                        i++;
                    }
                    i++;
                    //author
                    string userName = null;
                    while (chars[i] != '|')
                    {
                        userName += chars[i];
                        i++;
                    }
                    i++;
                    var author = UserRepository.FindByNameAsync(userName).Result;
                    forumMessage.AuthorId = author?.Id ?? _deleted.Id;

                    while (chars[i] != 10)
                    {
                        i++;
                    }
                    //    if (UseLimit)
                    //     {
                    //         theme?.Messages.Add(forumMessage);
                    //     }
                    if (theme != null)
                    {
                        var result = ForumMessageRepository.CreateAsync(forumMessage).Result;
                    }

                    Console.Write("| " + (i*1.00 / chars.Length).ToString("P"));
                }
             //   ForumMessageRepository.SaveChangesAsync().Wait();
            }
            Console.WriteLine("End UpdateForumComments");
        }

        #endregion

        #region UpdateDB
        //public static void UpdateBlogCategoryAndBlogItem()
        //{
        //    Console.WriteLine("Start UpdateBlogCategoryAndBlogItem");
        //    var blogCategories = UnitOfWork.BlogCategoryRepository.Get().ToList();
        //    var blogs = UnitOfWork.BlogItemRepository.Get().ToList();
        //    foreach (var blogCategory in blogCategories)
        //    {
        //        if (blogCategory.BlogItems == null)
        //        {
        //            blogCategory.BlogItems = new List<BlogItem>();
        //        }
        //        foreach (var blog in blogs.Where(blog => blog.CategoryId == blogCategory.Id))
        //        {
        //            blog.BlogCategory = blogCategory;
        //            blogCategory.BlogItems.Add(blog);
        //        }
        //    }
        //    UnitOfWork.Save();
        //}

        //public static void UpdateNewsCategoryAndNewsItem()
        //{
        //    Console.WriteLine("Start UpdateNewsCategoryAndNewsItem");
        //    var newsCategories = UnitOfWork.MaterialCategoryRepository.Get().ToList();
        //    var news = UnitOfWork.MaterialRepository.Get().ToList();
        //    foreach (var newsCategory in newsCategories)
        //    {
        //        if (newsCategory.Materials == null)
        //        {
        //            newsCategory.Materials = new List<Material>();
        //        }
        //        foreach (var newss in news.Where(newss => newss.CategoryId == newsCategory.Id))
        //        {
        //            newss.NewsCategory = newsCategory;
        //            newsCategory.Materials.Add(newss);
        //        }
        //    }
        //    UnitOfWork.Save();
        //}

        public static void UpdateCommentsLinks()
        {
            var bag = new ConcurrentBag<MaterialComment>();
            Console.WriteLine("Start UpdateCommentsLinks");
            var allComments = MaterialCommentRepository.GetListAsync().Result.ToList();
            var commentsWithParent = MaterialCommentRepository.GetListAsync().Result.Where(c => c.OldParentId != null).ToList();
            var counter = 0;
            var count = commentsWithParent.Count;
            Parallel.ForEach(commentsWithParent, comment =>
            {
                var parentComment = allComments.FirstOrDefault(x => x.OldId == comment.OldParentId);
                comment.ParentId = parentComment?.Id;
                Console.Write("| " + (counter++ * 1.00 / count).ToString("P"));
             //   MaterialCommentRepository.Update(comment);
                bag.Add(comment);
            });
            MaterialCommentRepository.UpdateRange(bag.ToList());
          //  MaterialCommentRepository.SaveChangesAsync().Wait();
        }

        public static void UpdateMaterialLinks()
        {
            var bag = new ConcurrentBag<Material>();
            Console.WriteLine("Start UpdateMaterialLinks");
            var allMaterials = _db.Materials.ToList();
            var counter = 0;
            var count = allMaterials.Count;
            Parallel.ForEach(allMaterials, material =>
            {
                if (string.IsNullOrWhiteSpace(material.PhotoPath))
                {
                    material.PhotoPath = DefaultPhotoPath;
                }
                else
                {
                    if (DefaultPhotoPath != material.PhotoPath)
                    {
                        material.PhotoPath = material.PhotoPath.Replace("http://www.myliverpool.ru", "").Replace("/_nw/", "/content/images/_nw/").Replace("/_bl/", "/content/images/_bl/");
                    }
                }
                if (material.Message != null)
                {
                    material.Message = material.Message
                        .Replace("http://www.myliverpool.ru", "")
                        .Replace("<!--IMG1-->", "")
                        .Replace("<!--IMG2-->", "")
                        .Replace("<!--IMG3-->", "")
                        .Replace("<!--IMG4-->", "")
                        .Replace("<!--IMG5-->", "")
                        .Replace("<!--IMG6-->", "")
                        .Replace("<!--IMG7-->", "").Replace("/_nw/", "/content/images/_nw/").Replace("/_bl/", "/content/images/_bl/");
                }
                if (material.Brief != null)
                {
                    material.Brief = material?.Brief
                        .Replace("http://www.myliverpool.ru", "")
                        .Replace("<i>", "")
                        .Replace("</i>", "")
                        .Replace("<!--IMG1-->", "")
                        .Replace("<!--IMG2-->", "")
                        .Replace("<!--IMG3-->", "")
                        .Replace("<!--IMG4-->", "")
                        .Replace("<!--IMG5-->", "")
                        .Replace("<!--IMG6-->", "")
                        .Replace("<!--IMG7-->", "").Replace("/_nw/", "/content/images/_nw/").Replace("/_bl/", "/content/images/_bl/");
                }

                Console.Write("| " + (counter++ * 1.00 / count).ToString("P"));
             //   MaterialCommentRepository.Update(comment);
                bag.Add(material);
            });
            _db.Materials.UpdateRange(bag.ToList());
            _db.SaveChanges();
        }

        public static void UpdateCommentsForum()
        {
            Console.WriteLine("Start UpdateCommentsForum");

            var posts = ForumMessageRepository.GetListAsync(null, 15, true).Result;
            var themes = ForumThemeRepository.GetListAsync().Result;
            foreach (var theme in themes)
            {
                foreach (var post in posts.Where(post => theme.Id == post.ThemeId))
                {
                    post.Theme = theme;
                    if (theme.Messages == null)
                    {
                        theme.Messages = new List<ForumMessage>();
                    }
                    theme.Messages.Add(post);
                }
            }
        }

        public static void UpdateForumSectionAndSubsection()
        {
            Console.WriteLine("Start UpdateForumSectionAndSubsection");
            var sections = ForumSectionRepository.GetListAsync().Result;
            var subSections = ForumSubsectionRepository.GetListAsync().Result;
            foreach (var section in sections)
            {
                foreach (var subSection in subSections)
                {
                    if (subSection.SectionId == section.Id)
                    {
                        subSection.Section = section;
                        if (section.Subsections == null)
                        {
                            section.Subsections = new List<ForumSubsection>();
                        }
                        section.Subsections.Add(subSection);
                    }
                }
            }
          //  ForumSubsectionRepository.SaveChangesAsync().RunSynchronously(); // above not duplicating?

        }

        public static void UpdateForumSubSectionAndTheme()
        {
            Console.WriteLine("Start UpdateForumSubSectionAndTheme");
            var themes = ForumThemeRepository.GetListAsync().Result;
            var subSections = ForumSubsectionRepository.GetListAsync().Result;

            foreach (var subSection in subSections)
            {
                foreach (var theme in themes.Where(theme => subSection.Id == theme.SubsectionId))
                {
                    theme.Subsection = subSection;
                    if (subSection.Themes == null)
                    {
                        subSection.Themes = new List<ForumTheme>();
                    }
                    subSection.Themes.Add(theme);
                }
            }
          //  ForumSubsectionRepository.SaveChangesAsync().RunSynchronously(); // above not duplicating?
        }


        #endregion

        private static LiverpoolContext GetNewContext()
        {
            return new LiverpoolContext(new DbContextOptions<LiverpoolContext>(), true);
        }

        private static string GetFirstImagePath(string message)
        {
            return GetImagesPath(message)[1].Value;
        }

        private static GroupCollection GetImagesPath(string message)
        {
            return Regex.Match(message, "<img.+?src=[\"'](.+?)[\"'].+?>", RegexOptions.IgnoreCase).Groups;
        }

        private static T[] SubArray<T>(T[] data, int index, int length)
        {
            T[] result = new T[length];
            Array.Copy(data, index, result, 0, length);
            return result;
        }
    }
}

