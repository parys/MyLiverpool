import { tap } from 'rxjs/operators';

import { State, Action, StateContext, Selector, createSelector } from '@ngxs/store';

import { UsersStateModel } from './users.model';
import { GetRoleGroups, GetUsersList, ChangeSort, SetPmReceiverId, ChangePage, SetUsersFilterOptions } from './users.actions';
import { RoleGroupService } from '@role-groups/core';

import { GetUsersListQuery } from '@network/shared';
import { UserService } from '@users/user.service';


@State<UsersStateModel>({
    name: 'users',
    defaults: {
        users: [],
        user: null,
        roleGroups: [],
        request: new GetUsersListQuery.Request({ currentPage: 1, pageSize: 15, sortDirection: 'desc', sortOn: 'lastModified' }),
        pmReceiver: null
    },
})
export class UsersState {

    @Selector()
    static user(state: UsersStateModel) {
        return state.user;
    }

    @Selector()
    static users(state: UsersStateModel) {
        return state.users;
    }

    @Selector()
    static userId(state: UsersStateModel) {
        return state.user ? state.user.id : null;
    }

    @Selector()
    static pmReceiver(state: UsersStateModel) {
        return state.pmReceiver;
    }

    @Selector()
    static userName(state: UsersStateModel) {
        return state.user ? state.user.userName : null;
    }

    @Selector()
    static roleGroups(state: UsersStateModel) {
        return state.roleGroups;
    }

    @Selector()
    static request(state: UsersStateModel) {
        return state.request;
    }

    constructor(protected network: RoleGroupService, protected usersNetwork: UserService) { }

    @Action(ChangeSort)
    @Action(ChangePage)
    @Action(SetUsersFilterOptions)
    onChangeSort({ patchState, getState, dispatch }: StateContext<UsersStateModel>, { payload }: ChangeSort) {
        const { request } = getState();
        patchState({ request: { ...request, ...payload } });
        dispatch(new GetUsersList());
    }

    @Action(GetUsersList)
    onGetUsersList(ctx: StateContext<UsersStateModel>) {
        const { request } = ctx.getState();
        return this.usersNetwork.getAll2(new GetUsersListQuery.Request(request))
        .pipe(
            tap(response => {
                ctx.patchState({ users: response.results || [] });
                ctx.patchState({ request: {...request, rowCount: response.rowCount,
                                         currentPage: response.currentPage, pageSize: response.pageSize } });
            }));
    }


    @Action(GetRoleGroups)
    onGetRoleGroups({ patchState, getState }: StateContext<UsersStateModel>) {
        const { roleGroups } = getState();
        if (roleGroups.length === 0) {
            return this.network.getAll()
                .pipe(
                    tap(response => { patchState({ roleGroups: response || [] }); }),
                );
        }
    }

    @Action(SetPmReceiverId)
    onSetPmReceiverId({patchState}: StateContext<UsersStateModel>, { payload }: SetPmReceiverId) {
        patchState({pmReceiver: payload});
    }

}