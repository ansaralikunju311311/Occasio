// import "../shared/config/env"
import '../src/shared/loader/env';
import app from './app';
import { initializaApp } from './shared/loader/index';
// import { clearExpiredOtpJob } from "../shared/loaders/index"
const startServer = async (): Promise<void> => {
  try {
    await initializaApp();
    //    clearExpiredOtpJob()
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`the server is running properly on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.log(error);
  }
};
startServer();
