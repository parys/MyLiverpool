//using Swashbuckle.AspNetCore.Swagger;
//using Swashbuckle.AspNetCore.SwaggerGen;

//namespace MyLiverpool.Web.WebApiNext.Extensions
//{
//    /// <summary>
//    /// Fix for https://github.com/domaindrivendev/Ahoy/issues/47
//    /// </summary>
//    public class HandleModelbinding : IOperationFilter
//    {
//        /// <summary>
//        /// 
//        /// </summary>
//        /// <param name="operation"></param>
//        /// <param name="context"></param>
//        public void Apply(Operation operation, OperationFilterContext context)
//        {
//            if (operation.Parameters == null) return;

//            foreach (IParameter param in operation.Parameters)
//            {
//                if (param.In == "modelbinding")
//                    param.In = "query";
//            }
//        }
//    }
//}
