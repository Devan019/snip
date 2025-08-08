import e from "express"
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import CreateApolloServer from "./graphql/user/index.js";
import UserService from "./service/user.service.js";


const PORT = process.env.PORT || 3000


async function InitServer() {
  const app = e()

  app.use(cors());
  app.use(e.json());

  app.use('/graphql',
    expressMiddleware(await CreateApolloServer(), {
      context: async ({ req }) => {
        const token = req.headers['token'];
        
        if (!token) {
          return { user: null };
        }
        try {
          const user = UserService.decodeJWT(token as string);
          if (user) {
            return { user };
          }

          return {};
        } catch (error) {
          return { user: null };
        }
      }
    }),

  );

  app.get("/", (req, res) => {
    res.send("Hello World!")
  })
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
}

InitServer();