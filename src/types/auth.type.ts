
export interface signUpType {
    name: string;
    email: string;
    phoneNum: string;
    password: string
    
} 

export interface ParamsId {
    params: {id: string}
}

export interface jwtItems {
    id: string,
    name: string,
    email: string,
    phoneNum: string
}