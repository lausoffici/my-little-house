import { useState } from "react";
import { GetServerSideProps } from "next";
import {
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  HStack,
  Box,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";

import studentsApi from "student/api";
import AddStudentDrawer from "student/AddStudentDrawer";
import { IStudent } from "types";

import { RiSearchLine } from "react-icons/ri";
import Link from "next/link";

interface Props {
  students: IStudent[];
}

const Page: React.FC<Props> = ({ students }) => {
  const [studentList, setStudentList] = useState<IStudent[]>(students);

  function handleAddStudent(student: IStudent) {
    setStudentList([...studentList, student]);
  }

  return (
    <VStack w="100%" h="100vh" bgColor="brand.50" p={5}>
      <HStack mb={5} w="100%">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <RiSearchLine />
          </InputLeftElement>
          <Input
            placeholder="Buscar"
            bgColor="white"
            _focus={{ borderColor: "brand.400" }}
          />
        </InputGroup>
        <AddStudentDrawer handleAddStudent={handleAddStudent} />
      </HStack>
      <Box overflowY="auto" w="100%">
        <Table colorScheme="gray" size="sm" bgColor="white">
          <Thead>
            <Tr>
              <Th py={3} fontSize="sm" bgColor="brand.200" color="brand.50">
                Apellido y Nombre
              </Th>
              <Th bgColor="brand.200" color="brand.50">
                Curso
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map(({ _id, firstName, lastName }) => (
              <Link href={"/students/" + _id} key={_id} passHref>
                <Tr role="button" _hover={{ bg: "brand.50" }}>
                  <Td>
                    {lastName.toUpperCase()}, {firstName}
                  </Td>
                  <Td>FCE</Td>
                </Tr>
              </Link>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async () => {
  const students = await studentsApi.findAll();

  return {
    props: {
      students: students,
    },
  };
};