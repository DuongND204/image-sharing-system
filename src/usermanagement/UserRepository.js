const API_URL = "http://localhost:5000/users";

export class UserRepository {
    async findAll() {
        const res = await fetch(API_URL);
        return res.json();
    }

    async updateUser(id, data) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.json();
    }

    async deleteUser(id) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        return res.json();
    }

    async createUser(data) {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.json();
    }

    async findById(id) {
        const res = await fetch(`${API_URL}/${id}`);
        return res.json();
    }
}
