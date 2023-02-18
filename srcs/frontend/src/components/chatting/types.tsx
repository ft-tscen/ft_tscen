import React from "react";

export interface Message {
    name :string,
    target? :string,
    text :string,
	time? :string,
    type? :string,
};

export type InputEvent = React.FormEvent<HTMLFormElement>;

export const SERVER_PORT :number = 2222;

export const SOCKET_EVENT = {
    JOIN: "JOIN",
    DOSCONNECT: "disconnect",
    CHANGE_NICKNAME: "CHANGE_NICKNAME",
    SEND: "SEND",
    RECEIVE: "RECEIVE"
}

export const SHOW_CHATROOM :boolean = true;
export const SHOW_OTHER :boolean = false;

export const ENTER_CHANNEL :boolean = true;
export const LEAVE_CHANNEL :boolean = false;

const CHANNEL :string = "채널 생성\n/CHANNEL <public/private/protected> (<비밀번호>) <채널 이름>"
const DM :string = "다이렉트 메세지\n/DM <유저 이름> <보낼 메세지>";
const INVITE :string = "게임 초대\n/INVITE <유저 이름/닉네임>";
const PROFILE :string = "유저 프로필\n/PROFILE <유저 이름/닉네임>";

const ROOMSTATE :string = "채널 상태 변경\n/ROOMSTATE <public/private/protected> (<비밀번호>)"
const PASSWORD :string = "패스워드 설정\n/PASSWORD <비밀번호>";
const HANDOVER :string = "방장 넘겨주기\n/HANDOVER <유저 이름/닉네임>"
const BAN :string = "유저 강퇴\n/BAN <유저 이름> <시간(초)>";
const MUTE :string = "유저 채팅 숨김\n/MUTE <유저 이름> <시간(초)>";

export const WRONGINPUT :string = "잘못된 입력입니다.";
export const HELP :string = `----------------------- 명령어 목록 ------------------------
꺽쇠기호(\'<\', \'>\')속 지정된 문자열에 White Space는 문자가 아닙니다.
채널의 비밀번호는 채널상태가 private, protected일때만 입력합니다.

${CHANNEL}

${DM}

${INVITE}

${PROFILE}

---------------------- 채널 주인 명령어 ---------------------

${ROOMSTATE}

${PASSWORD}

${HANDOVER}

${BAN}

${MUTE}
`;

export const STARTMSG : Message = {
    name :"server",
    text :"반갑습니다!\n사용법 확인은 \"/HELP\"를 입력해주세요.",
    time :new Date().toLocaleTimeString('en-US'),
}