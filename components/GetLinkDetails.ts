export const getLinkDetails = async (
  link: string
): Promise<Object | undefined> => {
  try {
    const request = await fetch(`/api/get/user/${link}`);
    const response = await request.json();
    return response;
  } catch (e) {
    console.error(e);
  }
}