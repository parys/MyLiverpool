﻿'use strict';
angular.module('forum.ctrl')
    .controller('ForumSubsectionController', [
        'ForumFactory', '$rootScope', '$stateParams',
        function(ForumFactory, $rootScope, $stateParams) {
            var vm = this;
            vm.themes = [];
            vm.pageNo = 1;
            vm.countPage = 1;
            vm.id = undefined;
            vm.name = undefined;
            vm.description = undefined;
            vm.sections = undefined;
            vm.item = undefined;

            vm.init = function() {
                ForumFactory.getSubsection()
                    .then(function(response) {
                            vm.themes = response.themes.list;
                            vm.pageNo = response.themes.pageNo;
                            vm.countPage = response.themes.countPage;
                            vm.id = response.id;
                            vm.name = response.name;
                            vm.description = response.description;
                            $rootScope.$title = vm.name;
                        },
                        function(response) {

                        });
            };

            vm.initEdit = function() {
                ForumFactory.getSections()
                    .then(function(response) {
                            vm.sections = response;
                        },
                        function(response) {
                        });
                if ($stateParams.id) {
                    ForumFactory.getSubsection($stateParams.id)
                        .then(function(response) {
                                vm.item = response;
                            },
                            function(response) {

                            });
                }
            }

            vm.save = function() {
                if (vm.item.id) {
                    ForumFactory.updateSubsection(vm.item)
                        .then(function (response) {
                            
                        },
                            function (response) {

                            });
                } else {
                    ForumFactory.createSubsection(vm.item)
                        .then(function (response) {
                            
                        },
                            function (response) {

                            });
                }
            }
        }
    ]);