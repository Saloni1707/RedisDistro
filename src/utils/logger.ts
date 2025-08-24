function timestamp(){
    return new Date().toISOString();
}

export const logger={
    info:(msg:string) => {
        console.log(`[INFO] ${timestamp()}: ${msg}`);
    },
    success:(msg:string) => {
        console.log(`[SUCCESS] ${timestamp()}: ${msg}`);
    },
    error:(msg:string) => {
        console.log(`[ERROR] ${timestamp()}: ${msg}`);
    },
    warn:(msg:string) => {
        console.warn(`[WARN] ${timestamp()}: ${msg}`);
    }
}