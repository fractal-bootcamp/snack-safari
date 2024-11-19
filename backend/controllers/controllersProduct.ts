import type { Request, Response } from "express";
import prisma from "../prisma/client";
import { withLogging } from "../utils/withLogging";
import type { CreateProductProps } from "../types/types";

export const getProductsFromCountry = withLogging(
  "getProductsFromCountry",
  false,
  async (req: Request, res: Response) => {
    const { country } = req.body;
    const response = await prisma.product.findMany({
      where: {
        country: country,
      },
    });
    res.status(200).json(response);
  }
);

export const getProduct = withLogging("getProduct", false, async (req: Request, res: Response) => {
  const { productId } = req.body;
  const response = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  res.status(200).json(response);
});

export const createProduct = withLogging("createProduct", false, async (req: Request, res: Response) => {
  const { product }: CreateProductProps = req.body;
  
  // Validate required fields
  if (!product.name || typeof product.inventory_count !== 'number' || typeof product.price !== 'number') {
    return res.status(400).json({ 
      error: 'Missing required fields. Name, inventory_count, and price are required.' 
    });
  }

  try {
    const response = await prisma.product.create({
      data: product,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

const product = {
  "product": {
    "name": "Kurkure Masala Munch",
    "description": "Crunchy corn puffs with authentic Indian spices",
    "imageUrl": "https://res.cloudinary.com/ds4kobyhb/image/upload/v1732043048/snack-safari/q7ftdqokkn5nq1abfid4.jpg", // Remote URL
    "country": "INDIA", // Assuming your enum uses uppercase
    "category": "Snacks",
    "inventory_count": 100,
    "price": 299
  }
}