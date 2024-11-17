"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash, Download, Plus, Lock } from "lucide-react";
import ConnectButton from "@/components/ConnectButton";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import abi from "@/lib/abi.json";
import { SecretNetworkClient, Wallet } from "secretjs";

const initialDummyStrings = [
  { id: 1, label: "Database Key for AWS", category: "API Keys" },
  { id: 2, label: "GitHub Personal Access Token", category: "API Keys" },
];

export default function Home() {
  const [savedStrings, setSavedStrings] = useState(initialDummyStrings);
  const [newString, setNewString] = useState({
    label: "",
    value: "",
    category: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [decryptedString, setDecryptedString] = useState("");
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [decryptedStrings, setDecryptedStrings] = useState<{
    [key: number]: string;
  }>({});

  const handleAddString = () => {
    setSavedStrings([
      ...savedStrings,
      { id: savedStrings.length + 1, ...newString },
    ]);

    send(newString.label, newString.value);
    setNewString({ label: "", value: "", category: "" });
    setIsAddDialogOpen(false);
  };

  const send = async (label: string, value: string) => {
    if (isConnected && walletProvider) {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0xcf0F715227b09E9D73Fb81A37D826F1dEdfB18e2",
        abi.abi,
        signer
      );

      const tx = await contract.send(
        "secret",
        "secret1dkkeehr702ysu7p40gttv04cmglt52lavn77jt",
        `${label}:  ${value}`,
        { value: ethers.BigNumber.from("710000000000000000") }
      );
      console.log(tx);
    }
  };

  const get_stored_message = async (sender: string, label: string) => {
    // Changed to const
    const wallet = new Wallet(process.env.MNEMONIC);

    const secretjs = new SecretNetworkClient({
      chainId: "pulsar-3",
      url: "https://api.pulsar3.scrttestnet.com",
      wallet: wallet,
      walletAddress: wallet.address,
    });

    const contractCodeHash =
      "c7f0f3a1fac97b11eecc3737ced7a102bb1dee70da74aa2bf20a38f6943589d5";
    const contractAddress = "secret1dkkeehr702ysu7p40gttv04cmglt52lavn77jt";

    const query: { message: string } =
      await secretjs.query.compute.queryContract({
        // Specified type instead of any
        contract_address: contractAddress,
        query: {
          get_stored_message: { sender: sender },
        },
        code_hash: contractCodeHash,
      });

    console.log("Raw query result:", query);

    if (query) {
      const [storedLabel, storedValue] = query.message.split(":");

      if (storedLabel.trim() === label.trim()) {
        return storedValue.trim();
      } else {
        console.log("No message found with the given label");
        return null;
      }
    } else {
      console.log("Unexpected query result structure");
      return null;
    }
  };

  const handleDelete = (id: number) => {
    setSavedStrings(savedStrings.filter((str) => str.id !== id));
  };

  const handleExport = (label: string) => {
    if (decryptedString) {
      const element = document.createElement("a");
      const file = new Blob([decryptedString], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${label.replace(/\s+/g, "_")}_decrypted.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      console.log(
        "Decrypted value not found. Please decrypt the string first."
      );
    }
  };

  useEffect(() => {
    // get_stored_message();
    // console.log(decryptedString);
  }, []);

  const handleDecrypt = async (id: number, label: string) => {
    if (address) {
      const decryptedValue = await get_stored_message(address, label);
      if (decryptedValue) {
        setDecryptedStrings((prev) => ({ ...prev, [id]: decryptedValue }));
        setDecryptedString(decryptedValue);
      } else {
        setDecryptedString("No message found or error occurred");
      }
    } else {
      setDecryptedString("Please connect your wallet");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <Lock className="mr-2 h-8 w-8" />
            Secret Vault
          </h1>
          <ConnectButton />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-gray-700 rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Secure Strings</h2>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-300">
              Safely store and manage your critical information
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add New String
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Critical String</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new critical string you want to
                    save.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="label" className="text-right">
                      Label
                    </Label>
                    <Input
                      id="label"
                      value={newString.label}
                      onChange={(e) =>
                        setNewString({ ...newString, label: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      Value
                    </Label>
                    <Input
                      id="value"
                      type="password"
                      value={newString.value}
                      onChange={(e) =>
                        setNewString({ ...newString, value: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setNewString({ ...newString, category: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="API Keys">API Keys</SelectItem>
                        <SelectItem value="Seed Phrases">
                          Seed Phrases
                        </SelectItem>
                        <SelectItem value="Passwords">Passwords</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddString}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800">
                <TableHead className="text-gray-300">Label</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedStrings.map((str) => (
                <TableRow key={str.id} className="border-b border-gray-700">
                  <TableCell className="font-medium">{str.label}</TableCell>
                  <TableCell>{str.category}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleDecrypt(str.id, str.label)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-white">
                          <DialogHeader>
                            <DialogTitle>Decrypted String</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 p-4 bg-gray-700 rounded-md">
                            <pre>
                              {decryptedStrings[str.id] || "Not decrypted yet"}
                            </pre>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handleDelete(str.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => handleExport(str.label)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <footer className="bg-gray-800 text-center py-4 text-gray-400 mt-auto">
        <p>&copy; 2024 Secret Vault. All rights reserved.</p>
      </footer>
    </div>
  );
}
