import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  handleEdit,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="w-full h-48">
          <img
            src={product?.phone_img}
            alt={product?.phone_brand}
            className="w-full h-full object-contain"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">
            {`${product?.phone_brand || ''} ${product?.phone_name || ''}`}
          </h2>

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${product?.saleprice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
            >
              ${product?.originalprice}
            </span>
            {product?.saleprice > 0 ? (
              <span className="text-lg font-bold">${product?.saleprice}</span>
            ) : null}
          </div>
          <h2 className="text-sm font-bold mb-2 mt-2">
            {`${"(" + product?.ram + "GB RAM &" || ''} ${product?.storage + "GB STORAGE)" || ''}`}
          </h2>
          <h2 className="text-base font-bold mb-2 mt-2">{"Color : " + product?.color}</h2>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => handleEdit(product)}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;