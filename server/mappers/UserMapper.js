export const UserMapper = {
  toDTO(user) {
    if (!user) return null;
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  },

  toDTOList(list) {
    return list.map(u => this.toDTO(u));
  },
};
