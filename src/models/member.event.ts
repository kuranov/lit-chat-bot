import {MemberModel} from "./member.model";

export interface MemberEvent {
  type: 'online' | 'offline';
  member: MemberModel;
}
