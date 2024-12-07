import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const parentDetailsPostReq = async (req, res) => {
                              try {
                              const {
                              username,
                              name,
                              surname,
                              email,
                              phone,
                              address,                      
                              createdAt,
                              } = req.body;
                             console.log(req.body);
                             if (
                              !username ||
                              !name ||
                              !surname ||
                              !email ||
                              !phone ||
                              !address ||
                              !createdAt                              
                          ) {
                              return res.status(400).json({
                                  message: "Missing required fields",
                              });
                          }
                          const newParents = await prisma.parent.create({
                              data: {
                                  username,
                                  name,
                                  surname,
                                  email,
                                  phone,
                                  address,     
                                  createdAt: new Date(createdAt),
                              },
                          });
                  
                          return res
                              .status(201)
                              .json({ message: "parent has been created successfully", data: newParents });
                              } catch (error) {
                               res
                              .status(500)
                              .json({ message: "Internal Server Error", error: error.message });
                              }
}