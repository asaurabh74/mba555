import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';

export interface ICustomer {
    id: number;
    firstName?: string;
    summary?: string;
    lastName?: string;
    gender?: string;
    Address?: string;
    city?: string;
    state?: IState;
    orders?: IOrder[];
    orderTotal?: number;
    latitude?: number;
    longitude?: number;
    checked?: boolean;
    ID?: number;
    GT_ASVAB_SCORE?: number;
    GM_ASVAB_SCORE?: number;
    CO_ASVAB_SCORE?: number;
    ST_ASVAB_SCORE?: number;
    Installation?: string;
    ASG_ELIG_CD?: string;
    UIC?: string;
    UNIT?: string;
    MIL_ED_LVL_CD?: string;
    INSTALLATION?: string;
    PrimaryEmail?: string;
    SecondaryEmail?: string;
    qualWomos?: string;
    primaryWomos?: string;
    rank?: JSON;
    DistributionGroup: JSON;
    Territory: JSON;
    PacketProcessingStatus: JSON;
    assignee: string;
}

export interface ISearchFilter {
    query: string;
    fieldName: string;
}

export interface IFieldOption {
    id: string;
    value: string;
}

export interface ICandidateField {
    name: string;
    displayName?: string;
    fieldName: string;
    editable: boolean;
    type: string;
    options?: IFieldOption[];
}


export interface EditOutput {
    newObj: JSON;
    oldObj: JSON;
}

export interface IMapDataPoint {
    longitude: number;
    latitutde: number;
    markerText?: string;
}

export interface IState {
    abbreviation: string;
    name: string;
}

export interface IOrder {
    productName: string;
    itemCost: number;
}

export interface IOrderItem {
    id: number;
    productName: string;
    itemCost: number;
}

export interface IPagedResults<T> {
    totalRecords: number;
    results: T;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IApiResponse {
    status: boolean;
    error?: string;
}
