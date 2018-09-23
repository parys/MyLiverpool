using System;
using System.Collections.Generic;

namespace MyLiverpool.Data.Common
{
    [Serializable]
    public class PageableData<T> : IPageable where T : class
    {
        protected int ItemPerPageDefault = 15;
        public IEnumerable<T> List { get; set; }
        public int PageNo { get; set; }
        public int TotalItems { get; set; }
        public int ItemPerPage { get; set; }
        public int TotalPages { get; set; }

        public PageableData(IEnumerable<T> list, int? page, int totalItems = 1, int itemPerPage = 0)
        {
            ItemPerPage = itemPerPage == 0 ? ItemPerPageDefault : itemPerPage;
            PageNo = page ?? 1;
            TotalItems =
                totalItems; //(int)decimal.Remainder(TotalItems, itemPerPage) == 0 ? TotalItems / itemPerPage : TotalItems / itemPerPage + 1;
            List = list;
            TotalPages = (int) Math.Ceiling(TotalItems / (double) ItemPerPage);
        }

        public bool HasPreviousPage => PageNo > 1;

        public bool HasNextPage => PageNo < TotalPages;
    }
}
