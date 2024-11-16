import React from 'react';
import { filterOptions } from "@/config";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

function ProductFilter({ filters, handleFilter }) {

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.entries(filterOptions).map(([keyItem, options]) => (
          <React.Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold capitalize">{keyItem.replace('_', ' ')}</h3>
              <div className="grid gap-2 mt-2">
                {options.map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-2">
                    <Checkbox
                      checked={filters[keyItem]?.includes(option.id) || false}
                      onCheckedChange={() => {
                        console.log(`Checkbox changed: ${keyItem} - ${option.id}`);
                        handleFilter(keyItem, option.id);
                      }}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
