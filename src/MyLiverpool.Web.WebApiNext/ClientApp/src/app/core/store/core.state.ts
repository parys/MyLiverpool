import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';

// import { Network } from '@network/network';
// import { environment } from '@environments/environment';
// import { isExternalReportType, PerspectiveType } from '@domain/enums';
// import { GetPerspectivesListQuery, GetWorkflowStatesListQuery, GetUserGroupsListQuery, GetExamTypesListQuery } from '@network/shared';
// import { copyToClipboard } from '@domain/static';
// import { ShowNotification } from '@notifications/store';
// import { NotificationMessage } from '@notifications/shared';
// import { toDictionary } from '@domain/operators';
// import { AuthState } from '@auth/store';

import { CoreStateModel } from '@core/store/core-state.model';
import {
    // GetRoles,
    // GetUserGroups,
    // GetWorkflowStates,
    // GetExamTypes,
    // GetMonitoringTypes,
    // GetModalities,
    // GetExamSpaces,
    // GetReportTypes,
    // GetSites,
    // GetPerspectivesList,
    // CopyBugReport,
    ChangeMobile
} from '@core/store/core.actions';

declare var platform: any;

@State<CoreStateModel>({
    name: 'core',
    defaults: {
        // userGroups: [],
        // userGroupsMap: {},
        // monitoringTypes: [],
        // workflowStates: [],
        // workflowStatesMap: {},
        // examTypes: [],
        // examTypesMap: {},
        // modalities: [],
        // examSpaces: [],
        // reportTypes: [],
        // roles: [],
        // sites: [],
        // perspectives: [],
        // perspectivesMap: {},
        mobile: false
    },
})
export class CoreState {

    @Selector()
    static mobile(state: CoreStateModel) {
        return state.mobile;
    }

    // @Selector()
    // static sites(state: CoreStateModel) {
    //     return state.sites;
    // }

    // @Selector()
    // static perspectivesMap(state: CoreStateModel) {
    //     return state.perspectivesMap;
    // }

    // @Selector()
    // static reviewPerspectives(state: CoreStateModel) {
    //     return state.perspectives.filter(x => x.perspectiveTypeId === PerspectiveType.Review);
    // }

    // @Selector()
    // static aquisitionPerspectives(state: CoreStateModel) {
    //     return state.perspectives.filter(x => x.perspectiveTypeId === PerspectiveType.Acquire);
    // }

    // @Selector()
    // static reportTypes(state: CoreStateModel) {
    //     return state.reportTypes.filter(type => !isExternalReportType(type.reportTypeId));
    // }

    // @Selector()
    // static monitoringTypes(state: CoreStateModel) {
    //     return state.monitoringTypes;
    // }

    // @Selector()
    // static workflowStates(state: CoreStateModel) {
    //     return state.workflowStates;
    // }

    // @Selector()
    // static workflowStatesMap(state: CoreStateModel) {
    //     return state.workflowStatesMap;
    // }

    // @Selector()
    // static examTypes(state: CoreStateModel) {
    //     return state.examTypes;
    // }

    // @Selector()
    // static examTypesMap(state: CoreStateModel) {
    //     return state.examTypesMap;
    // }

    // @Selector()
    // static userGroups(state: CoreStateModel) {
    //     return state.userGroups;
    // }

    // @Selector()
    // static regularUserGroups(state: CoreStateModel) {
    //     return (state.userGroups || []).filter(x => !x.monitoringTypeId);
    // }

    // @Selector()
    // static monitoringUserGroups(state: CoreStateModel) {
    //     return (state.userGroups || []).filter(x => !!x.monitoringTypeId).sort((a, b) => a.groupName.toLowerCase().localeCompare(b.groupName));
    // }

    // @Selector()
    // static userGroupsMap(state: CoreStateModel) {
    //     return state.userGroupsMap;
    // }

    // @Selector()
    // static modalities(state: CoreStateModel) {
    //     return state.modalities;
    // }

    // @Selector()
    // static examSpaces(state: CoreStateModel) {
    //     return state.examSpaces;
    // }

    constructor(//protected network: Network, private translate: TranslateService,
         private store: Store) { }

    @Action(ChangeMobile)
    onChangeMobile({ patchState }: StateContext<CoreStateModel>, { payload }: ChangeMobile) {
        patchState({ mobile: payload });
    }

    // @Action(GetRoles)
    // onGetRoles({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.rolesApi.getList()
    //         .pipe(
    //             tap(response => {
    //                 setState(patch({ roles: response.results || [] }));
    //             })
    //         );
    // }

    // @Action(GetSites)
    // onGetSites({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.sitesApi.getList()
    //         .pipe(
    //             tap(response => {
    //                 setState(patch({ sites: response.results || [] }));
    //             })
    //         );
    // }

    // @Action(GetWorkflowStates)
    // onGetWorkflowStates({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.workflowStatesApi.getList()
    //         .pipe(
    //             tap(response => {
    //                 const workflowStates = response.results || [];
    //                 const workflowStatesMap = toDictionary<GetWorkflowStatesListQuery.WorkflowStateListDto>(workflowStates, x => x.workflowStateId, x => x.workflowStateName);
    //                 setState(patch({ workflowStates, workflowStatesMap }));
    //             })
    //         );
    // }

    // @Action(GetUserGroups)
    // onGetUserGroups({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.userGroupsApi.getList()
    //         .pipe(
    //             tap(response => {
    //                 const userGroups = response.results || [];
    //                 const userGroupsMap = toDictionary<GetUserGroupsListQuery.UserGroupListDto>(userGroups, x => x.userGroupId, x => x.groupName);
    //                 setState(patch({ userGroups, userGroupsMap }));
    //             })
    //         );
    // }

    // @Action(GetModalities)
    // onGetModalities({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.modalitiesApi.getList()
    //         .pipe(
    //             tap(response => {
    //                 setState(patch({ modalities: response.results || [] }));
    //             })
    //         );
    // }

    // @Action(GetMonitoringTypes)
    // onGetMonitoringTypes({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.monitoringTypesApi.getList()
    //         .pipe(
    //             tap(response => {
    //                 setState(patch({ monitoringTypes: response.results || [] }));
    //             })
    //         );
    // }

    // @Action(GetExamTypes)
    // onGetExamTypes({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.examTypesApi.getList()
    //         .pipe(
    //             tap(response => {
    //                 const examTypes = response.results || [];
    //                 const examTypesMap = toDictionary<GetExamTypesListQuery.ExamTypeListDto>(examTypes, x => x.examTypeId, x => x.examTypeName);
    //                 setState(patch({ examTypes, examTypesMap }));
    //             })
    //         );
    // }

    // @Action(GetExamSpaces)
    // onGetExamSpaces({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.examSpacesApi.getList()
    //         .pipe(
    //             tap(response => {
    //                 setState(patch({ examSpaces: response.results || [] }));
    //             })
    //         );
    // }

    // @Action(GetReportTypes)
    // onGetReportTypes({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.reportTypesApi.getList()
    //         .pipe(
    //             tap(response => {
    //                 setState(patch({ reportTypes: response.results || [] }));
    //             })
    //         );
    // }


    // @Action(GetPerspectivesList)
    // onGetPerspectivesList({ setState }: StateContext<CoreStateModel>) {
    //     return this.network.perspectiveApi.getList(new GetPerspectivesListQuery.Request())
    //         .pipe(
    //             tap(response => {
    //                 const perspectives = response.results || [];
    //                 const perspectivesMap = toDictionary<GetPerspectivesListQuery.PerspectiveListDto>(perspectives, x => x.perspectiveId, x => x.name);
    //                 setState(patch({ perspectives, perspectivesMap }));
    //             })
    //         );
    // }


    // @Action(CopyBugReport)
    // onCopyBugReport({ dispatch }: StateContext<CoreStateModel>) {
    //     return this.network.settingsApi.getBuildInfo()
    //         .pipe(
    //             tap(info => {

    //                 const clientBuildDate = environment.buildInfo.buildTime ? new Date((+environment.buildInfo.buildTime) * 1000) : new Date();
    //                 const serverBuildDate = info.buildTime ? new Date((+info.buildTime) * 1000) : new Date();

    //                 const bugReportInfo = `OS: ${platform.os.toString()};
    //                            Browser: ${platform.name} ${platform.version};
    //                            Screen: ${screen.width}x${screen.height};
    //                            Zoom: ${Math.round(window.devicePixelRatio * 100)}% (${window.innerWidth}x${window.innerHeight});
    //                            Logged in user info: ${this.store.selectSnapshot(AuthState.username)};
    //                            Local time: ${new Date().toTimeString()};
    //                            Url: ${location.href};
    //                            Client Build: Branch - ${environment.buildInfo.branch}, Commit Hash - ${environment.buildInfo.commit}, Build Time - ${clientBuildDate};
    //                            Server Build: Branch - ${info.branch}, Commit Hash - ${info.commit}, Build Time - ${serverBuildDate};`;

    //                 copyToClipboard(bugReportInfo);
    //                 dispatch(new ShowNotification(NotificationMessage.warning(this.translate.instant('MESSAGES.REPORT_BUG_UPLOADED'), this.translate.instant('MESSAGES.REPORT_BUG_UPLOADED_SUCCESSFULLY'))));
    //             })
    //         )
    // }

}
