export type UserProps = {
    id: string;
    email: string;
    username: string;
};

export type ApiErrorProps = {
    statusCode: number;
    timestamp: string;
    path: string;
    exception: string;
    message: string;
};

export type AuthSessionResponse = {
    user: UserProps & {
        iat: string;
        exp: string;
    };

}

export interface AuthLoginResponse extends UserProps { iat: string; token: string; }
