export class GetUserGroups {
    static readonly type = '[Core] Get user groups';
}

export class GetRoles {
    static readonly type = '[Core] Get roles list';
}

export class GetMonitoringTypes {
    static readonly type = '[Core] Get monitoring types list';
}

export class GetWorkflowStates {
    static readonly type = '[Core] Get workflow states list';
}

export class GetExamTypes {
    static readonly type = '[Core] Get exam types list';
}

export class GetModalities {
    static readonly type = '[Core] Get modalities list';
}

export class GetExamSpaces {
    static readonly type = '[Core] Get exam spaces list';
}


export class GetReportTypes {
    static readonly type = '[Core] Get report types list';
}

export class GetSites {
    static readonly type = '[Core] Get sites list';
}

export class GetPerspectivesList {
    static readonly type = '[Core] Get perspectives list';
}

export class CopyBugReport {
    static readonly type = '[Core] Copy bug report';
}

export class ChangeMobile {
    static readonly type = '[Core] Change mobile view';
    constructor(public readonly payload: boolean) { }
}
