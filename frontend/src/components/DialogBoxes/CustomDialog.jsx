import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '../ui/dialog';

export default function CustomDialog({ Details, Description, Content, open, onOpenChange  }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
        <DialogHeader>
            <DialogTitle className="text-center">{Details}</DialogTitle>
            <DialogDescription className="text-center">
            {Description}
            </DialogDescription>
        </DialogHeader>
        {Content}
        </DialogContent>
    </Dialog>
  )
}
