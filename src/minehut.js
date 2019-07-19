var url = 'https://api.minehut.com';

const MinehutAPI = class {
    constructor() {
        this.session = null;
    }
    
    async getLoginSession(email, password) {
        const data = await fetch(`${url}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        }).then(res => res.json());
        
        this.session = data;

        return data;
    }

    async ghostLogin(token, sessionId) {
        const data = await fetch(`${url}/users/ghost_login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
                'x-session-id': sessionId
            }
        }).then(res => res.json());

        this.session = data;

        return data;
    }
    
    setManualSession(sessionData) {
		this.session = sessionData;
    }
    
    server(id) {
        return new MinehutServer(id, this.session);
    }
    
    async createServer(name, platform = 'java') {
        if (platform !== 'java') 
            throw new Error(`Invalid server type ${platform}. Must be java`);
        
        return await fetch(`${url}/servers/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.session.token,
                'x-session-id': this.session.sessionId
            },
            body: JSON.stringify({ name, platform })
        }).then(res => res.json());
    }

    async getServer(id, byName) {
        return await fetch(byName ? `${api}/server/${id}?byName=true` : `${api}/server/${id}`).then(res => res.json());
    }
    
    async getServers() {
        return await fetch(`${url}/servers`).then(res => res.json());
    }

    async getTopServers() {
        return await fetch(`${url}/network/top_servers`).then(res => res.json());
    }

    async getSimpleStats() {
        return await fetch(`${url}/network/simple_stats`).then(res => res.json());
    }

    async getPublicPlugins() {
        return await fetch(`${url}/plugins_public`).then(res => res.json());
    }

    async getPlugins() {
        return await fetch(`${url}/plugins`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.session.token,
                'x-session-id': this.session.sessionId
            }
        }).then(res => res.json());
    }

    async getUser(id) {
        return (await fetch(`${url}/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.session.tooken,
                'x-session-id': this.session.sessionId
            }
        }).then(res => res.json())).user;
    }

    async getCurrentUser() {
        return await this.getUser(this.session.id);
    }
}

const MinehutServer = class {
    constructor(id, { token, sessionId }) {
        this.token = token;
        this.session = sessionId;
        this.id = id;

        this.reqHeaders = {
            'Authorization': this.token,
            'x-session-id': this.session,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    }
    

    /*
    
        Server Information / Metrics

    */

    async serverData() {
        return await fetch(`${url}/servers/${this.id}/server_data`, {
            method: 'GET',
            headers: this.reqHeaders
        }).then(res => res.json());
    }

    async serverStatus() {
        return await fetch(`${url}/server/${this.id}/status`, {
            method: 'GET',
            headers: this.reqHeaders
        }).then(res => json.res());
    }

    /*
    
        Server Administration/ Content Manipulation

    */

    async start() {
        return await fetch(`${url}/server/${this.id}/start`, {
            method: 'POST',
            headers: this.reqHeaders
        }).then(res => res.json());
    }

    async shutdown() {
        return await fetch(`${url}/server/${this.id}/shutdown`, {
            method: 'POST',
            headers: this.reqHeaders
        }).then(res => res.json());
    }

    async startService() {
        return await fetch(`${url}/server/${this.id}/start_service`, {
            method: 'POST',
            headers: this.reqHeaders
        }).then(res => res.json());
    }
    
    async destroyService() {
        return await fetch(`${url}/server/${this.id}/destroy_service`, {
            method: 'POST',
            headers: this.reqHeaders
        }).then(res => res.json());
    }
    
    async repairFiles() {
        return await fetch(`${url}/server/${this.id}/repair_files`, {
            method: 'POST',
            headers: this.reqHeaders
        }).then(res => res.json());
    }

    async resetAll() {
        return await fetch(`${url}/server/${this.id}/reset_all`, {
            method: 'POST',
            headers: this.reqHeaders
        }).then(res => res.json());
    }

    async sendCommand(command) {
        return await fetch(`${url}/server/${this.id}/send_command`, {
            method: 'POST',
            headers: this.reqHeaders,
            body: JSON.stringify({ command })
        }).then(res => res.json());
    }
    
    async changeName(name) {
        return await fetch(`${url}/server/${this.id}/change_name`, {
            method: 'POST',
            headers: this.reqHeaders,
            body: JSON.stringify({ name })
        }).then(res => res.json());
    }
    
    async changeMOTD(motd) {
        return await fetch(`${url}/server/${this.id}/change_motd`, {
            method: 'POST',
            headers: this.reqHeaders,
            body: JSON.stringify({ motd })
        }).then(res => res.json());
    }

    async visibility(bool) {
        return await fetch(`${url}/server/${this.id}/visibility`, {
            method: 'POST',
            headers: this.reqHeaders,
            body: JSON.stringify({ visibility: bool })
        }).then(res => res.json());
    }

    async save() { // click the thingy on the left
        return await fetch(`${url}/server/${this.id}/save`, {
            method: 'POST',
            headers: this.reqHeaders
        }).then(res => res.json());
    }

    async resetWorld() {
        return await fetch(`${url}/server/${this.id}/reset_world`, {
            method: 'POST',
            headers: this.reqHeaders
        }).then(res => res.json());
    }
    
    /*
    
        Server File Structure/ File Manipulation

    */

    async listFiles(path) {
        return await fetch(`${url}/file/${this.id}/list/${path}`, {
            method: 'GET',
            headers: this.reqHeaders
        })
    }
    
    async editFile(path, content) {
        return await fetch(`${url}/file/${this.id}/edit/${path}`, {
            method: 'POST',
            headers: this.reqHeaders,
            body: JSON.stringify({ content })
        })
    }
}