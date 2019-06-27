﻿using System.Collections.Generic;
using AutoFixture;
using MyLfc.Application.Tests.Infrastructure;
using MyLfc.Application.Tests.Infrastructure.Customizations.Domain;
using MyLfc.Application.Tests.Infrastructure.Seeds;
using MyLfc.Domain;
using MyLiverpool.Data.Common;
using Xunit;

namespace MyLfc.Application.Tests.Materials.DeleteMaterialCommand
{
    [CollectionDefinition(nameof(DeleteMaterialCommandCollection))]
    public class DeleteMaterialCommandCollection : ICollectionFixture<DeleteMaterialCommandTestFixture> { }

    public class DeleteMaterialCommandTestFixture : BaseTestFixture
    {
        public static int DeletedMaterialId;
        public static int PendingMaterialId;
        public static List<Material> Materials { get; private set; }
        
        public DeleteMaterialCommandTestFixture()
        {
            Materials = MaterialSeed.Seed(Context);
            SeedMaterials();
        }

        private void SeedMaterials()
        {
            var deletedMaterial = new Fixture()
                .Customize(new MaterialCustomization(MaterialType.News, true))
                .Create<Material>();
            Context.Materials.Add(deletedMaterial);

            var pendingMaterial = new Fixture()
                .Customize(new MaterialCustomization(MaterialType.News, false))
                .Create<Material>();
            pendingMaterial.Pending = true;
            Context.Materials.Add(pendingMaterial);

            Context.SaveChanges();

            DeletedMaterialId = deletedMaterial.Id;
            PendingMaterialId = pendingMaterial.Id;
        }
    }
}
