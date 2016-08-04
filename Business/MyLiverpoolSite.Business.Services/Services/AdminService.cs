﻿using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using HtmlAgilityPack;
using MyLiverpoolSite.Business.Contracts;

namespace MyLiverpoolSite.Business.Services.Services
{
    public class AdminService : IAdminService
    {
        private string address = "http://www.sports.ru/epl/table/";
        private string xpathTableRows = "/html/body/div/div/div/div/div/div/div/table/tbody//tr";
        private string pathToRightSideBar = "app\\home\\views\\rightSidebar.html";
        private string pathToRightSideBar2 = "app\\home\\views\\rightSidebar1.html";

        public async Task<bool> UpdateTableAsync()
        {
            var trNodes = await GetHtmlRowsAsync();
            var clubs = trNodes.Select(trNode => new
            {
                position = trNode.ChildNodes[1].InnerText,
                name = trNode.ChildNodes[3].InnerText,
                matches = trNode.ChildNodes[5].InnerText,
                won = trNode.ChildNodes[7].InnerText,
                draw = trNode.ChildNodes[9].InnerText,
                lost = trNode.ChildNodes[11].InnerText,
                goals = int.Parse(trNode.ChildNodes[13].InnerText) - int.Parse(trNode.ChildNodes[15].InnerText),
                points = trNode.ChildNodes[17].InnerText
            }).ToList();

             var path = HttpContext.Current.Server.MapPath("~");
            var newPath = Path.Combine(path, pathToRightSideBar2);
            
            using (var writer = new StreamWriter(newPath, false))
              {
                  var newRows = new StringBuilder(
                          @"<table class=""table table-condensed table-striped table-responsive col-xs-12 overflowable"">
    <thead>
        <tr>
            <th>#</th>
            <th>Команда</th>
            <th>И</th>
            <th>В</th>
            <th>Н</th>
            <th>П</th>
            <th>+/-</th>
            <th>О</th>
        </tr>
    </thead>
    <tbody>");
                foreach (var club in clubs)
                {
                    newRows.AppendLine($"<tr><td>{club.position}</td><td>{club.name}</td><td>{club.matches}</td><td>{club.won}</td><td>{club.draw}</td><td>{club.lost}</td><td>{club.goals}</td><td>{club.points}</td></tr>");
                }
                newRows.Append("</tbody></table>");

                  await writer.WriteAsync(newRows.ToString());
                  writer.Close();
            }
            
            var newPath1 = Path.Combine(path, pathToRightSideBar);
            File.Copy(newPath, newPath1, true);

            return true;
        }

        private async Task<HtmlNodeCollection> GetHtmlRowsAsync()
        {
            HttpClient http = new HttpClient();
            var response = http.GetByteArrayAsync(address).Result;
            String source = Encoding.GetEncoding("utf-8").GetString(response, 0, response.Length - 1);
            source = WebUtility.HtmlDecode(source);
            HtmlDocument resultat = new HtmlDocument();
            resultat.LoadHtml(source);

            var trNodes = resultat.DocumentNode.SelectNodes(xpathTableRows);
            return trNodes;
        }
    }
}
