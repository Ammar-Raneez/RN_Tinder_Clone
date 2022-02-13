// Delete logged in user, break down matched user object into
// [matchedUserId, matchedUserDetails]
const getMatchedUserInfo = (users: any, userLoggedIn: any) => {
  const newUsers = { ...users };
  delete newUsers[userLoggedIn];
  const [id, user] = Object.entries(newUsers).flat();
  return { id, ...user as any };
}

export default getMatchedUserInfo;
