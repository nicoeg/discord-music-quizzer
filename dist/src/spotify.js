"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const config_json_1 = __importDefault(require("../config.json"));
class Spotify {
    constructor() {
        this.client = new spotify_web_api_node_1.default({
            clientId: config_json_1.default.spotify.clientID,
            clientSecret: config_json_1.default.spotify.clientSecret
        });
    }
    authorize() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.clientCredentialsGrant();
            this.client.setAccessToken(response.body.access_token);
        });
    }
    getPlaylist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.getPlaylistTracks(id);
            return result.body.items.map(({ track }) => track);
        });
    }
}
exports.default = Spotify;
//# sourceMappingURL=spotify.js.map