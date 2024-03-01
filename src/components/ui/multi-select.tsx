import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Option } from '@/types';

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  notFoundMessage?: string;
  name: string;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      selected,
      onChange,
      className,
      notFoundMessage = 'Item no encontrado',
      name,
      ...props
    }: MultiSelectProps,
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleUnselect = (item: string) => {
      onChange(selected.filter((i) => i !== item));
    };
    return (
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={`w-full justify-between px-3 ${selected.length > 1 ? 'h-full' : 'h-11'}`}
            onClick={() => setOpen(!open)}
            ref={ref}
            asChild
          >
            <div
              role='button'
              tabIndex={0}
              aria-label='Seleccionar'
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setOpen(!open);
                  event.preventDefault();
                }
              }}
            >
              <input type='hidden' name={name} aria-hidden multiple value={selected.join(',')} className='hidden' />
              <div className='flex gap-1 flex-wrap'>
                {selected.map((value) => (
                  <Badge variant='secondary' key={value} className='text-sm' onClick={() => handleUnselect(value)}>
                    {options.find((option) => option.value === value)?.label}
                    <button
                      className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUnselect(value);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleUnselect(value)}
                    >
                      <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                      <span className='sr-only'>Eliminar</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
          <Command className={className}>
            <CommandInput placeholder='Buscar ...' />
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            <CommandGroup className='max-h-64 overflow-auto'>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value]
                    );
                    setOpen(true);
                  }}
                  className={'cursor-pointer'}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', selected.includes(option.value) ? 'opacity-100' : 'opacity-0')}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
