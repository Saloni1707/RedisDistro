export interface EmailTask{
    [x: string]: any;
    to:string;
    subject:string;
    body:string;
    retries?:number;
}

export interface StoredTask{
    id:string;
    task:EmailTask;
    attempts:number;
}