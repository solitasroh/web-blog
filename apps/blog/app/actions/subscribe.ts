"use server";

export async function subscribe(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  // Here you would add your logic to handle the subscription,
  // such as saving the email to a database or sending it to an API.
  const email = formData.get("email") as string;
  if (!email || !email.includes("@")) {
    return { success: false, message: "유효한 이메일 주소를 입력해주세요." };
  }
  console.log(`Subscribing ${email} to the newsletter.`);
  return { success: true, message: "구독이 성공적으로 완료되었습니다!" };
}
