import { connect } from "mongoose"

async function ConnectDataBase() {
  const URL = process.env.MONGODB_URL

  if (!URL)
    throw new Error("MONGODB_URL environment variable is not set.");

  try {
    await connect(`${URL}`)
    console.log("Success connecting to database")
  }
  catch (err: any) {
    throw new Error(err.message)
  }
}

export default ConnectDataBase
