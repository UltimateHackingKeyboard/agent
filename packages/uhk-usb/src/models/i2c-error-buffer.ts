export interface Slave {
    id: number;
    name: string;
}

export interface I2cErrorStatus {
    code: number;
    name: string;
    count: number;
}

export interface I2cErrorBuffer {
    isExists: boolean;
    slave: Slave;
    statuses: Array<I2cErrorStatus>;
}
