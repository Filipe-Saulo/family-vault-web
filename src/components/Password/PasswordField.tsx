import type { Control, FieldValues, Path } from 'react-hook-form'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

interface PasswordFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    autoComplete: string
}

export function PasswordField<T extends FieldValues>({
    control,
    name,
    label,
    autoComplete,
}: PasswordFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            type="password"
                            autoComplete={autoComplete}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
