import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, isLoading } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("saleprice-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    const initialFilters = {};
    for (const [key, value] of Object.entries(params)) {
      if (key !== "sort") {
        initialFilters[key] = value.split(",");
      }
    }

    setFilters(initialFilters);
    setSort(params.sort || "saleprice-lowtohigh");
  }, [searchParams]);
  useEffect(() => {

  }, [cartItems])


  const handleFilter = (keyItem, optionId) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (!newFilters[keyItem]) {
        newFilters[keyItem] = [optionId];
      } else if (newFilters[keyItem].includes(optionId)) {
        newFilters[keyItem] = newFilters[keyItem].filter((id) => id !== optionId);
        if (newFilters[keyItem].length === 0) {
          delete newFilters[keyItem];
        }
      } else {
        newFilters[keyItem] = [...newFilters[keyItem], optionId];
      }

      return newFilters;
    });
  };

  const handleSort = (value) => {
    setSort(value);
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value.length > 0) {
        params.append(key, value.join(","));
      }
    }

    params.set("sort", sort);
    setSearchParams(params);
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  useEffect(() => {
    updateSearchParams();
    dispatch(fetchAllFilteredProducts({
      filterParams: filters,
      sortParams: sort
    }));
  }, [filters, sort, dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
      />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Phones</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Phones
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem.id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                toast={toast}
              />
            ))
          ) : (
            <p>No Phone found</p>
          )}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;