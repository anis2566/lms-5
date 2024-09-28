import { User } from "@prisma/client";

import { TableHead, TableHeader, Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { EmptyData } from "@/components/empty-data";

interface UserWithPurchases extends User {
    purchases: {
        id: string;
    }[];
}

interface StudentListProps {
    students: UserWithPurchases[];
}

export const StudentList = ({ students }: StudentListProps) => {

    if (students.length === 0) {
        return <EmptyData title="No students found" />
    }

    return (
        <Table>
            <TableHeader>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Purchases</TableHead>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                    <TableRow key={student.id}>
                        <TableCell>
                            <Avatar>
                                <AvatarImage src={student.image ?? ""} />
                                <AvatarFallback>
                                    {student.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                            {student.purchases.length}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}