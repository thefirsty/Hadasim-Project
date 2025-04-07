﻿using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Dto;

namespace Service.Interfaces
{
    public interface ISupplierService
    {
        SupplierDto GetSupplierByUserId(int userId);
    }
}
