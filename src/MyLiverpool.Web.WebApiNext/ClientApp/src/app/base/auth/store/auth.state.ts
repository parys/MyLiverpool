import { State, Action, StateContext, Selector } from '@ngxs/store';

import { AuthStateModel } from './auth-state.model';
import { SetUser } from './auth.actions';


@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        user: null
    },
})
export class AuthState {

    @Selector()
    static user(state: AuthStateModel) {
        return state.user;
    }

    @Selector()
    static userId(state: AuthStateModel) {
        return state.user ? state.user.userId : null;
    }

    @Selector()
    static userName(state: AuthStateModel) {
        return state.user ? state.user.userName : null;
    }

    @Selector()
    static admin(state: AuthStateModel) {
        const roles = state.user && state.user.roles ? state.user.roles : [];
        return roles.includes('admin');
    }

    @Action(SetUser)
    onSetUser({ patchState }: StateContext<AuthStateModel>, { payload }: SetUser) {
        patchState({ user: { ...payload } });
    }

}
