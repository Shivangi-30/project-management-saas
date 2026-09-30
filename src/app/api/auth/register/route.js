export async function POST(request) {
  try {
    const data = await request.json();

    console.log("Received data:", data);

    return Response.json(
      {
        success: true,
        message: "Registration API working",
        data: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}