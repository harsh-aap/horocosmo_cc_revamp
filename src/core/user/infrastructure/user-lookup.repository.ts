import { Injectable } from "@nestjs/common";
import { BaseUserRepository } from "./base-user.repository";
import { UserLookupPort } from "../application/interfaces/user-lookup.interface";

@Injectable()
export class UserLookupRepository extends BaseUserRepository implements UserLookupPort {
    // No special method - only inherits common read operations from the base

    // - findById()
    // - findByIds()
    // - findByEmail()
    // - findActiveUsers()
    // - findActiveAstrologers()
    // - countUsers()
    // - countActiveAstrologers()
}
