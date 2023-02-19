import React from "react";

export interface SocketInputDto {
    author?: string; // nickname
    target?: string; // nickname or channel name
    message?: string;
    password?: string;
}
  
export interface SocketOutputDto {
    author?: string; // nickname
    target?: string; // nickname or channel name
    message?: string;
    // user?: User;
}

export interface ChannelType {
    name: string;
    hidden: boolean;
    password: boolean;
}
export type InputEvent = React.FormEvent<HTMLFormElement>;

export const SERVER_PORT :number = 3001;

export const SOCKET_EVENT = {
    MSG: "channel-msg",
    GET_CHANNEL: "channel-list",
    JOIN: "join-channel",
    LEAVE: "leave-channel",
    DOSCONNECT: "disconnect",
    CHANGE_NICKNAME: "CHANGE_NICKNAME",
}

export const SHOW_CHATROOM :boolean = true;
export const SHOW_OTHER :boolean = false;

export const ENTER_CHANNEL :boolean = true;
export const LEAVE_CHANNEL :boolean = false;

const CHANNEL :string = "채널 생성\n/CHANNEL <채널 이름>"
const DM :string = "다이렉트 메세지\n/DM <유저 이름> <보낼 메세지>";
const INVITE :string = "게임 초대\n/INVITE <유저 이름/닉네임>";
const PROFILE :string = "유저 프로필\n/PROFILE <유저 이름/닉네임>";
const BLOCK :string = "개인유저 채팅 숨김\n/BLOCK <유저 이름/닉네임>"

const ROOMSTATE :string = "채널 상태 변경\n/ROOMSTATE (-h[private]) (-p[protected] <비밀번호>)"
const EMPOWER :string = "ADMIN 권한 주기\n/EMPOWER <유저 이름/닉네임>"
const BAN :string = "유저 강퇴\n/BAN <유저 이름/닉네임>";
const MUTE :string = "채널유저 채팅 숨김\n/MUTE <유저 이름/닉네임>";

export const WRONGINPUT :string = "잘못된 입력입니다.";
export const HELP :string = `-------------------------- 명령어 목록 ---------------------------
꺽쇠기호(\'<\', \'>\')속 지정된 문자열에 White Space는 문자가 아닙니다.

${CHANNEL}

${DM}

${INVITE}

${PROFILE}

${BLOCK}

---------------------- CHANNEL OWNER 명령어 ---------------------

${ROOMSTATE}

${EMPOWER}

${BAN}

${MUTE}

---------------------- CHANNEL ADMIN 명령어 ---------------------

${BAN}

${MUTE}
`;

export const STARTMSG : SocketOutputDto = {
    author :"server",
    message :"반갑습니다!\n사용법 확인은 \"/HELP\"를 입력해주세요.",
}