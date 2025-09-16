import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from './schemas/order-status.schema';
import { CreateOrderDto, FilterTransactionsDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const customOrderId = this.generateCustomOrderId();

    const order = new this.orderModel({
      ...createOrderDto,
      custom_order_id: customOrderId,
    });

    return order.save();
  }

  async getAllTransactions(filterDto: FilterTransactionsDto) {
    const { page, limit, sort, order, status, school_id, gateway, start_date, end_date } = filterDto;
    
    const matchConditions: any = {};
    
    if (status) {
      matchConditions['orderStatus.status'] = status;
    }
    
    if (school_id) {
      matchConditions.school_id = school_id;
    }
    
    if (gateway) {
      matchConditions.gateway_name = gateway;
    }
    
    if (start_date || end_date) {
      matchConditions.created_at = {};
      if (start_date) {
        matchConditions.created_at.$gte = new Date(start_date);
      }
      if (end_date) {
        matchConditions.created_at.$lte = new Date(end_date);
      }
    }

    // Build aggregation pipeline
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'order_status',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'orderStatus'
        }
      },
      {
        $unwind: {
          path: '$orderStatus',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    // Add match stage if there are conditions
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Add projection stage
    pipeline.push({
      $project: {
        collect_id: '$_id',
        school_id: 1,
        gateway: '$gateway_name',
        order_amount: 1,
        transaction_amount: { $ifNull: ['$orderStatus.transaction_amount', '$order_amount'] },
        status: { $ifNull: ['$orderStatus.status', '$status'] },
        custom_order_id: 1,
        student_info: 1,
        payment_mode: '$orderStatus.payment_mode',
        payment_time: '$orderStatus.payment_time',
        created_at: 1,
        updated_at: 1
      }
    });

    // Add sorting
    const sortField = sort === 'payment_time' ? 'orderStatus.payment_time' : sort;
    const sortOrder = order === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });

    // Execute aggregation with pagination
    const skip = (page - 1) * limit;
    const [transactions, totalCount] = await Promise.all([
      this.orderModel.aggregate([
        ...pipeline,
        { $skip: skip },
        { $limit: limit }
      ]),
      this.orderModel.aggregate([
        ...pipeline,
        { $count: 'total' }
      ])
    ]);

    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async getTransactionsBySchool(schoolId: string, filterDto: FilterTransactionsDto) {
    const transactions = await this.getAllTransactions({
      ...filterDto,
      school_id: schoolId
    });

    return transactions;
  }

  async getTransactionStatus(customOrderId: string) {
    const order = await this.orderModel.findOne({ custom_order_id: customOrderId });
    
    if (!order) {
      throw new NotFoundException('Transaction not found');
    }

    const orderStatus = await this.orderStatusModel.findOne({ collect_id: order._id });

    return {
      custom_order_id: customOrderId,
      status: orderStatus?.status || order.status,
      order_amount: order.order_amount,
      transaction_amount: orderStatus?.transaction_amount || order.order_amount,
      payment_mode: orderStatus?.payment_mode || null,
      payment_time: orderStatus?.payment_time || null,
      gateway: order.gateway_name,
      student_info: order.student_info
    };
  }

  async findOrderByCustomId(customOrderId: string): Promise<Order> {
    const order = await this.orderModel.findOne({ custom_order_id: customOrderId });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    return order;
  }

  private generateCustomOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD_${timestamp}_${random}`;
  }

  // Seed dummy data for testing
  async seedDummyData() {
    try {
      const existingOrders = await this.orderModel.countDocuments();
      if (existingOrders > 0) {
        return { message: 'Dummy data already exists' };
      }

      const dummyOrders = [];
      const dummyOrderStatuses = [];

      for (let i = 1; i <= 10; i++) {
        const orderId = new this.orderModel()._id;
        const customOrderId = `ORD_${Date.now()}_${i.toString().padStart(3, '0')}`;
        
        const order = {
          _id: orderId,
          school_id: '65b0e6293e9f76a9694d84b4',
          trustee_id: '65b0e552dd31950a9b41c5ba',
          student_info: {
            name: `Student ${i}`,
            id: `STU00${i}`,
            email: `student${i}@example.com`
          },
          gateway_name: ['PhonePe', 'Paytm', 'Razorpay'][i % 3],
          custom_order_id: customOrderId,
          order_amount: 1000 + (i * 100),
          status: 'pending'
        };

        const orderStatus = {
          collect_id: orderId,
          order_amount: order.order_amount,
          transaction_amount: order.order_amount + 50,
          payment_mode: ['upi', 'card', 'netbanking'][i % 3],
          payment_details: `payment_detail_${i}`,
          bank_reference: `BANK_REF_${i}`,
          payment_message: 'Payment successful',
          status: ['success', 'pending', 'failed'][i % 3],
          error_message: 'NA',
          payment_time: new Date(),
          gateway: order.gateway_name,
          custom_order_id: customOrderId
        };

        dummyOrders.push(order);
        dummyOrderStatuses.push(orderStatus);
      }

      await this.orderModel.insertMany(dummyOrders);
      await this.orderStatusModel.insertMany(dummyOrderStatuses);

      return { message: 'Dummy data seeded successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to seed dummy data: ' + error.message);
    }
  }
}